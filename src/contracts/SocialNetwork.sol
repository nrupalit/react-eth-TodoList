pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint public postCount = 0;
    mapping(uint => Post) public posts;
    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }
    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    constructor() public {
        name = 'Nrupali'; 
    }

    // Create posts and List all post
    function createPost(string memory _content) public {
        require(bytes(_content).length > 0 );
        postCount ++;
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        emit PostCreated(postCount, _content, 0, msg.sender);
    }
    // Tip posts
    function tipPost(uint _id) public payable {
        require(_id > 0 && _id <= postCount);
        // Fetch the post
        Post memory _post = posts[_id];
        // fetch the author
        address payable _author = _post.author;
        // pay the author
        address(_author).transfer(msg.value);
        // Increment tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update post
        posts[_id] = _post;
        // Trigger an event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }
}