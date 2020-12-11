<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',  'sender_id',
    ];

    protected $with = ['sender'];

    public function scopeBySender($q, $sender)
    {
        $q->where('sender_id', $sender);
    }


    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
