import axios from "axios";
const baseUrl = "http://localhost:3001/";
// const baseUrl = "/";
export class ApiClient {
  constructor(
    credentialsProvider,
    logoutHandler,
    modalHandler,
    redirectHandler,
    credentialsManager,
    loadData
  ) {
    this.credentialsProvider = credentialsProvider;
    this.logoutHandler = logoutHandler;
    this.modalHandler = modalHandler;
    this.redirectHandler = redirectHandler;
    this.credentialsManager = credentialsManager;
    this.loadData = loadData;
  }

  async apiCall(
    method = "get",
    url = "/",
    payload = {},
    successMessage = undefined,
    callback = undefined
  ) {
    try {
      // try to make the request
      const res = await axios({
        method,
        url: `${baseUrl}${url}`,
        ...payload,
      });
      // trigger modal if success message and successful
      if (successMessage) {
        this.modalHandler(res.status, successMessage);
      }
      if (callback) {
        // trigger callback if callback and successful
        // also exposes the response data to the callback if needed
        try {
          callback(res);
        } catch (err) {
          this.modalHandler(
            err?.response?.staus || "404",
            err?.response?.data?.error || "Callback Error"
          );
        }
      }
      return res;
    } catch (err) {
      // if 498, access token has expired, throw error to be handled in authenticatedApi call
      if (err?.response?.status === 498) {
        throw new Error("498");
      }
      // else alery user to error
      this.modalHandler(
        err.response?.staus || "404",
        err.response?.data.error || "Sorry something went wrong"
      );
      this.logoutHandler();
      return {};
    }
  }

  // Added to base api call, this method add credentials in the headers of this request
  // and includes logic for token expiry error
  async authenticatedCall(method, url, payload, successMessage, callback) {
    // verify credentials exist
    const { accessToken, _id } = this.credentialsProvider();
    if (!accessToken || !_id) {
      this.redirect("/login");
      return { message: "Missing Credentials" };
    }
    try {
      // send along the base request with escalated credentials
      const res = await this.apiCall(
        method,
        `admin/${url}`,
        {
          headers: {
            accessToken,
            userId: _id,
          },
          ...payload,
        },
        successMessage,
        callback
      );
      return { ...res };
    } catch (error) {
      if (error.message === 498) {
        // token expired
        const { accessToken, _id } = this.credentialsProvider();
        // get updated access token based off refresh token
        const updatedCredentials = await this.apiCall(
          "get",
          "/token",
          {
            data: {
              accessToken,
            },
            headers: {
              accessToken,
            },
          },
          successMessage,
          callback
        );
        // extract payload
        const [updateA] = [updatedCredentials?.data?.accesstoken];
        // once credentials have been uplaoded, resend request with updated credentials
        const res = await this.authenticatedCall(method, url, {
          ...payload,
          headers: {
            accessToken: updateA,
            userId: _id,
          },
          successMessage,
          callback,
        });
        return res;
      }
      return {};
    }
  }

  redirect(url) {
    // inherited from react-router-dom, exposes a function to redirect programmatically from client
    this.redirectHandler(url);
  }

  async getStreamHeaders(index) {
    return await this.apiCall("get", "streams/headers", { headers: { index } });
  }
  async newStream(newStreamData) {
    const newStream = await this.apiCall("post", "streams/add", {
      data: newStreamData,
    });
    return newStream;
  }

  async newPost(newPostData) {
    const newPost = await this.apiCall("post", "posts/add", {
      data: newPostData,
    });
    return newPost;
  }
  async getPosts(streamId = false, page = 0) {
    if (!streamId) {
      return await this.apiCall("get", "posts", { headers: { page } });
    } else {
      return await this.apiCall("get", `posts/${streamId}`, {
        headers: { page },
      });
    }
  }
  async login({ email, password }) {
    return await this.apiCall(
      "post",
      `login`,
      {
        data: {
          email,
          password,
        },
      },
      "Logged In!",
      undefined
    );
  }

  //private routes

  async updatePost(post) {
    return await this.authenticatedCall(
      "post",
      "posts/update",
      { data: post },
      "Post Updated!",
      () => this.loadData()
    );
  }
  async updateStream(stream) {
    // console.log(stream);
    return await this.authenticatedCall(
      "post",
      "streams/update",
      { data: stream },
      "Stream Updated!",
      () => this.loadData()
    );
  }
  async deletePost(id) {
    return await this.authenticatedCall(
      `delete`,
      `posts/${id}`,
      undefined,
      "Post Deleted!",
      () => this.loadData()
    );
  }
}
