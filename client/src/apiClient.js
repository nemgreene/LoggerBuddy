import axios from "axios";
// const baseUrl = "http://localhost:3001/";
const baseUrl = "/";
export class ApiClient {
  constructor(
    credentialsProvider,
    logoutHandler,
    modalHandler,
    redirectHandler,
    credentialsManager,
    loadTaggedData,
    loadStreams
  ) {
    this.credentialsProvider = credentialsProvider;
    this.logoutHandler = logoutHandler;
    this.modalHandler = modalHandler;
    this.redirectHandler = redirectHandler;
    this.credentialsManager = credentialsManager;
    this.loadTaggedData = loadTaggedData;
    this.loadStreams = loadStreams;
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
      this.redirect("/");
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

  async getStreamHeaders(streamId = false) {
    return await this.apiCall("get", "streams/headers", {
      headers: { streamId },
    });
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

  async getTaggedPosts(tags = [], page = 1, trackedStream = undefined) {
    return await this.apiCall(
      `post`,
      `posts/tagged`,
      { data: { tags, page, trackedStream } }
      // "Error fetching tagged posts!"
      // () => this.loadTaggedData()
    );
  }

  //Scrumboard public
  async getScrumBoard(trackedStream) {
    return await this.apiCall("get", `scrum/${trackedStream}`);
  }
  //private routes

  async newStream(newStreamData) {
    return await this.authenticatedCall(
      "post",
      "streams/add",
      {
        data: newStreamData,
      },
      "Stream Updated",
      () => {
        this.loadStreams();
      }
    );
  }

  async newPost(newPostData) {
    const newPost = await this.authenticatedCall("post", "posts/add", {
      data: newPostData,
    });
    return newPost;
  }

  async updatePost(post) {
    return await this.authenticatedCall(
      "post",
      "posts/update",
      { data: post },
      "Post Updated!",
      () => this.loadTaggedData()
    );
  }

  async updateStream(stream) {
    // console.log(stream);
    return await this.authenticatedCall(
      "post",
      "streams/update",
      { data: stream },
      "Stream Updated!",
      () => {
        // this.loadTaggedData(undefined, true);
        this.loadStreams();
      }
    );
  }

  async deletePost(id) {
    return await this.authenticatedCall(
      `delete`,
      `posts/${id}`,
      undefined,
      "Post Deleted!",
      () => {
        this.loadStreams();
        this.loadTaggedData();
      }
    );
  }

  //scrumboard Private
  async addScrum(trackedStream) {
    return await this.authenticatedCall(
      "post",
      "/scrum/add",
      {
        data: { trackedStream },
      },
      "Scrum Created"
    );
  }
  async addColumn(trackedStream, formData) {
    return await this.authenticatedCall(
      "post",
      "scrum/column/add",
      {
        data: { trackedStream, formData },
      },
      "Column Added"
    );
  }
  async editColumn(trackedStream, _id, formData) {
    return await this.authenticatedCall(
      "post",
      "scrum/column/edit",
      {
        data: { trackedStream, _id, formData },
      },
      "Column Updated"
    );
  }
  async deleteColumns(id) {
    return await this.authenticatedCall(
      "delete",
      `scrum/column/${id}`,
      undefined,
      "Column Deleted"
    );
  }

  //sync server sort order with frontend source of truth
  async updateColumns(trackedStream, update) {
    return await this.authenticatedCall("post", "scrum/column/sync", {
      data: { trackedStream, update },
    });
  }
  async updateTasks(trackedStream, update) {
    return await this.authenticatedCall("post", "scrum/tasks/sync", {
      data: { trackedStream, update },
    });
  }

  async addItem(trackedStream, formData) {
    return await this.authenticatedCall(
      "post",
      "scrum/item/add",
      {
        data: { trackedStream, formData },
      },
      "Item Added"
    );
  }
  async updateItem(trackedStream, formData) {
    return await this.authenticatedCall(
      "post",
      "scrum/item/update",
      {
        data: { trackedStream, formData },
      },
      "Item Updated"
    );
  }

  async taskUpdate(taskId, update) {
    return await this.authenticatedCall("post", "scrum/item/taskUpdate", {
      data: { taskId, update },
    });
  }

  async deleteItem(itemId) {
    return await this.authenticatedCall(
      "delete",
      `scrum/item/${itemId}`,
      undefined,
      "Item Deleted"
    );
  }
  // async getScrumBoard(trackedStream) {
  //   return {
  //     data: {
  //       columns: [
  //         {
  //           index: 0,
  //           id: "todo",
  //           title: "Todo",
  //           color: "red",
  //         },
  //         {
  //           index: 1,
  //           id: "doing",
  //           title: "Work in progress",
  //           color: "green",
  //         },
  //         {
  //           index: 2,
  //           id: "done",
  //           title: "Done",
  //           color: "blue",
  //         },
  //       ],
  //       items: [
  //         {
  //           id: "1",
  //           columnId: "todo",
  //           title: "List admin APIs for dashboard",
  //         },
  //         {
  //           id: "2",
  //           columnId: "todo",
  //           title:
  //             "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  //         },
  //         {
  //           id: "3",
  //           columnId: "doing",
  //           title: "Conduct security testing",
  //         },
  //         {
  //           id: "4",
  //           columnId: "doing",
  //           title: "Analyze competitors",
  //         },
  //         {
  //           id: "5",
  //           columnId: "done",
  //           title: "Create UI kit documentation",
  //         },
  //         {
  //           id: "6",
  //           columnId: "done",
  //           title: "Dev meeting",
  //         },
  //         {
  //           id: "7",
  //           columnId: "done",
  //           title: "Deliver dashboard prototype",
  //           comments: [
  //             { content: "comment1", date: new Date() },
  //             { content: "comment1", date: new Date() },
  //           ],
  //           links: ["google.com"],
  //           images: ["an image"],
  //         },
  //         {
  //           id: "8",
  //           columnId: "todo",
  //           title: "Optimize application performance",
  //         },
  //         {
  //           id: "9",
  //           columnId: "todo",
  //           title: "Implement data validation",
  //         },
  //         {
  //           id: "10",
  //           columnId: "todo",
  //           title: "Design database schema",
  //         },
  //         {
  //           id: "11",
  //           columnId: "todo",
  //           title: "Integrate SSL web certificates into workflow",
  //         },
  //         {
  //           id: "12",
  //           columnId: "doing",
  //           title: "Implement error logging and monitoring",
  //         },
  //         {
  //           id: "13",
  //           columnId: "doing",
  //           title: "Design and implement responsive UI",
  //         },
  //       ],
  //     },
  //   };
  // }
}
