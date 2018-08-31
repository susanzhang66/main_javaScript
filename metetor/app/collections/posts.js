//这里就是所谓的集合，我们在这里定义了这个Posts就是一个对于数据库posts表的资源链接，这样我们就可以在客服端和服务器那边操作这个posts表了
Posts = new Mongo.Collection('posts');

//这里就是对于操作数据库自定义方法的一些限制，我们总不可能让其为所欲为
Posts.allow({
    update: function(userId, post) {
        // 只允许修改自己的文章
        return ownsDocument(userId, post);
    },
    remove: function(userId, post) {
        // 只允许修改自己的文章
        return ownsDocument(userId, post);
    }
});
Posts.deny({
    update: function(userId, post, fieldNames, modifier) {
        // 需要完成修改的时候不允许修改为已经存在的url
        var rs = Posts.findOne({ url: modifier.$set.url, _id: { $ne: post._id } });
        if (rs) {
            return true;
        }
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});
Posts.deny({
    update: function(userId, post, fieldNames, modifier) {
        var errors = validatePost(modifier.$set);
        return errors.title || errors.url;
    }
});

validatePost = function(post) {
    var errors = {};
    if (!post.title)
        errors.title = "请填写标题";
    if (!post.url)
        errors.url = "请填写URL";
    return errors;
}

//还可以写一些自定义的操作
Meteor.methods({
    postInsert: function(postAttributes) {
        check(this.userId, String);
        check(postAttributes, {
            title: String,
            url: String
        });

        var errors = validatePost(postAttributes);
        if (errors.title || errors.url)
            throw new Meteor.Error('invalid-post', "你必须为你的帖子填写标题和 URL");


        var postWithSameLink = Posts.findOne({ url: postAttributes.url });
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }

        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        var postId = Posts.insert(post);

        return {
            _id: postId
        };
    },
    upvote: function(postId) {
        // 检查数据类型
        check(this.userId, String);
        check(postId, String);

        var affected = Posts.update({
            _id: postId,
            upvoters: {$ne: this.userId}
        },{
            $addToSet: {upvoters: this.userId},
            $inc: {votes: 1}
        });
        if (!affected) 
            throw new Meteor.Error('invalid', "You weren't able to upvote that post");
    }
});