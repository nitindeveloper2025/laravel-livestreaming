const socket = io("http://localhost:3000");
let localStream, remoteStream;
let peerConnection;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

document.getElementById("startStream").addEventListener("click", async () => {
    const streamId = prompt("Enter Stream ID:");
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    document.getElementById("localVideo").srcObject = localStream;
    
    peerConnection = new RTCPeerConnection(config);
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = event => {
        if (event.candidate) socket.emit("ice-candidate", { streamId, candidate: event.candidate });
    };

    peerConnection.ontrack = event => {
        if (!remoteStream) {
            remoteStream = new MediaStream();
            document.getElementById("remoteVideo").srcObject = remoteStream;
        }
        remoteStream.addTrack(event.track);
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    socket.emit("offer", { streamId, offer });

    socket.on("answer", async data => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on("ice-candidate", data => {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
});

document.getElementById("joinStream").addEventListener("click", async () => {
    const streamId = prompt("Enter Stream ID to Join:");
    socket.emit("join-stream", streamId);
    
    peerConnection = new RTCPeerConnection(config);
    peerConnection.onicecandidate = event => {
        if (event.candidate) socket.emit("ice-candidate", { streamId, candidate: event.candidate });
    };

    peerConnection.ontrack = event => {
        if (!remoteStream) {
            remoteStream = new MediaStream();
            document.getElementById("remoteVideo").srcObject = remoteStream;
        }
        remoteStream.addTrack(event.track);
    };

    socket.on("offer", async data => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById("localVideo").srcObject = localStream;
        
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        socket.emit("answer", { streamId, answer });
    });

    socket.on("ice-candidate", data => {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
});
