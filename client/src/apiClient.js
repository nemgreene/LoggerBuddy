import { red, blue, green, purple, yellow } from "@mui/material/colors";
import axios from "axios";
const baseUrl = "http://localhost:3001/";
export class ApiClient {
  constructor() {}

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
        //this.modalHandler(res.status, successMessage);
      }
      if (callback) {
        // trigger callback if callback and successful
        // also exposes the response data to the callback if needed
        try {
          callback(res);
        } catch (err) {
          // this.modalHandler(
          //   err?.response?.staus || "404",
          //   err?.response?.data?.error || "Callback Error"
          // );
        }
      }
      return res;
    } catch (err) {
      // if 498, access token has expired, throw error to be handled in authenticatedApi call
      if (err?.response?.status === 498) {
        throw new Error("498");
      }
      // else alery user to error
      // this.modalHandler(
      //   err.response?.staus || "404",
      //   err.response?.data.error || "Sorry something went wrong"
      // );
      // this.logoutHandler();
      return {};
    }
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
}
