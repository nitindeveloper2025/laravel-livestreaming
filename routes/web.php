<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/create-stream', function () {
    return response()->json(['streamId' => uniqid()]);
});

Route::get('/join/{streamId}', function ($streamId) {
    return view('welcome', ['streamId' => $streamId]);
});