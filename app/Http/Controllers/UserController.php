<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Cache;


class UserController extends Controller
{
    /**
     * @param Request $request
     */
    public function index(Request $request)
    {
    }



    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        if (! $token = auth('api')->attempt($validator->validated())) {
            return response()->json([
                'error' => 'incorrect_credentials',
                'message' => 'Incorrect email or password!'
            ], 500);
        }

        return response()->json($this->createNewToken($token), 200);
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|between:2,100',
            'last_name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
            'password_confirmation' => 'required_with:password|same:password|min:6'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $user = User::create(array_merge(
            $validator->validated(),
            [
                'password' => bcrypt($request->password),
                'role_id' => 1, //default user
            ]
        ));
        $data = [
            'email' => $user->email,
            'password' => $request->password,
        ];

        if (! $token = auth('api')->attempt($data)) {
            return response()->json([
                'error' => 'incorrect_credentials',
                'message' => 'Incorrect email or password!'
            ], 401);
        }

        return response()->json($this->createNewToken($token), 200);
    }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth('api')->logout();

        return response()->json(['message' => 'User successfully signed out'], 200);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile() {
        return response()->json(auth('api')->user());
    }

    public function onlineUsers()
    {
        $users = User::all();
        $users = $users->filter(function ($user, $key) {
            return Cache::has('user-is-online-' . $user->id);
        });

        return response()->json(['data' => $users], 200);

    }
    /**
     * @param $token
     *
     * @return array
     */
    protected function createNewToken($token){
        return  [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user()
        ];
    }
}
