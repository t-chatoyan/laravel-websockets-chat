<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\ChatRoom;
use App\Models\User;
use App\Events\ChatMessage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{

    /**
     * @param $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMessages()
    {
        $chat = Chat::orderBy('id')->get();

        return response()->json([
            'data' => $chat
        ], 200);
    }

    public function sendMessage(Request $request)
    {
        $auth_id = Auth::guard('api')->id();
        $chat = Chat::create([
            'message' => $request->message,
            'sender_id' => $auth_id,
        ]);

        $data =  $chat->load('sender');
        broadcast(new ChatMessage($data));

        return ['status' => 'success', 'chat' => $data];
    }

    private function getChannelName($id)
    {
        return 'chat-message';
    }
}
