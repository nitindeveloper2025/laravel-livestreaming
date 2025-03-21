<!DOCTYPE html>
<html lang="en">
<head>
    <title>Live Streaming</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
    <h2>Live Streaming</h2>
    
    <video id="localVideo" autoplay playsinline muted></video>
    <video id="remoteVideo" autoplay playsinline></video>
    
    <button id="startStream">Start Stream</button>
    <button id="joinStream">Join Stream</button>

    <script src="{{ asset('stream.js') }}"></script>
</body>
</html>
