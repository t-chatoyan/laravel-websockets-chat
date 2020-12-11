<template>
  <div class="row h-100 justify-content-center align-items-center">
    <div class="col-lg-3 col-md-5">
      <div class="jumbotron jumbotron-fluid">
        <h3 class="text-center">Login</h3>
        <div class="container">
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="email">Emai</label>
              <input v-model="formData.email" required type="email" class="form-control" id="email" placeholder="email" aria-describedby="emailHelp">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input v-model="formData.password" required type="password" class="form-control" placeholder="password" id="password">
            </div>
            <div class="form-group text-center">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>

            <div class="form-group">
              <router-link class="tag-item no-hover"  to="registration">
                Register
              </router-link>
            </div>
            <div>
              <ul >
                <li class="text-danger" v-for="(error, index) in errorMessages" :key="index">{{error}}</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {http} from "../../api";

  export default {
    data () {
      return {
        formData: {},
        disabledSubmitBtn: false,
        errorMessages: [],
        message: null
      }
    },
    mounted() {

    },
    methods: {
      login() {
        http.post('/login', this.formData).then(res => {
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          this.$router.push('/');
          Echo.connector.options.auth.headers['Authorization'] = 'Bearer ' + res.data.access_token
        }).catch(error => {
          const errors = error.response.data
          if (errors.message) {
            this.errorMessages.push(errors.message)
            return
          }
          for (const key in errors) {
            this.errorMessages.push(key + ': ' + errors[key])
          }
        }).finally(() =>{
          this.disabledSubmitBtn = false

        })
      }
    }
  }
</script>
