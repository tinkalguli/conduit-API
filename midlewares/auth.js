module.exports = {
    verifyAuthor : (authorId, currentUserId, res) => {
        console.log(authorId, currentUserId);
        if (authorId !== currentUserId) {
             res.status(403).json({ errors : { body : [ "You are not authorized" ]}});
        }
    }
}