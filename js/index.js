"use strict";

var MainContainer = new React.createClass({
  getInitialState: function getInitialState() {
    return {
      data: [],
      recent: "recent_active",
      alltime: false

    };
  },
  componentDidMount: function componentDidMount() {
    // get RECENT api
    $.ajax({
      url: "https://fcctop100.herokuapp.com/api/fccusers/top/recent",
      data: {
        format: 'json'
      },
      cache: false,
      success: function (data) {
        this.setState({ data: data, recent: "recent_active" });
        //  console.log(this.state.data);
      }.bind(this),
      error: function error() {
        console.error("ajax failed");
      }
    });
  },

  handleClick: function handleClick(ref, event) {
    this.switchResults(ref, event);
  },

  switchResults: function switchResults(ref, event) {
    // boolean check of state to see if recent is being displayed.
    // if false, change url of ajax request to grab alltime scores
    // update state with new json in data to rerender UI
    var url = "";
    if (ref === "recent_active") {
      url = "https://fcctop100.herokuapp.com/api/fccusers/top/alltime";
    } else if (ref === "alltime_active") {
      url = "https://fcctop100.herokuapp.com/api/fccusers/top/recent";
    }
    $.ajax({
      url: url,
      data: {
        format: 'json'
      },
      cache: false,
      success: function (data) {
        this.setState({ data: data, recent: ref === "recent_active" ? "alltime_active" : "recent_active" });
      }.bind(this),
      error: function error() {
        console.error("ajax failed");
      }
    });
  },

  render: function render() {
    // console.log(this.state.data);
    return React.createElement(TableComponent, { onClick: this.handleClick, data: this.state.data, recent: this.state.recent });
  }
});

var TableComponent = new React.createClass({
  render: function render() {

    return React.createElement(
      "div",
      { id: "frame" },
      React.createElement(
        "div",
        { "class": "title" },
        React.createElement(
          "h1",
          null,
          "Free Code Camp Leaderboard"
        )
      ),
      React.createElement(
        "table",
        null,
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              { className: "rank" },
              "Rank"
            ),
            React.createElement(
              "th",
              { className: "rank" },
              "Picture"
            ),
            React.createElement(
              "th",
              { className: "username" },
              "Username"
            ),
            React.createElement(
              "th",
              { onClick: this.props.onClick.bind(this, "alltime_active"), ref: "recent_active", className: this.props.recent === "recent_active" ? "active" : "inactive" },
              "Scores Last 30 Days"
            ),
            React.createElement(
              "th",
              { onClick: this.props.onClick.bind(this, "recent_active"), ref: "alltime_active", className: this.props.recent === "alltime_active" ? "active" : "inactive" },
              "Scores All Time"
            )
          )
        ),
        React.createElement(UserData, { data: this.props.data, recent: this.props.recent })
      )
    );
  }
});

var UserData = new React.createClass({
  render: function render() {
    var _this = this;

    var retrieve_users = this.props.data.map(function (user, index) {
      //console.log(user.username);
      var link = "https://www.freecodecamp.com/" + user.username;
      return React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          { className: "numbers" },
          index + 1
        ),
        React.createElement(
          "td",
          null,
          React.createElement("img", { src: user.img })
        ),
        React.createElement(
          "td",
          null,
          React.createElement(
            "a",
            { href: link, target: "_blank" },
            user.username
          )
        ),
        React.createElement(
          "td",
          { className: _this.props.recent === "recent_active" ? "active" : "" },
          user.recent,
          " "
        ),
        React.createElement(
          "td",
          { className: _this.props.recent === "alltime_active" ? "active" : "" },
          user.alltime,
          " "
        )
      );
    });
    return React.createElement(
      "tbody",
      null,
      retrieve_users
    );
  }
});

ReactDOM.render(React.createElement(MainContainer, null), document.getElementById("container"));