import {extendType, nonNull, objectType, stringArg, intArg} from "nexus";

export const Post = objectType({
    name: 'Post',
    definition(t) {
        t.int('id')
        t.string('title')
        t.string('body')
        t.boolean('published')
    },
});

export const PostQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('drafts', {
            type: "Post",
            resolve(parent, args, context, info) {
                return context.db.post.findMany({ where: { published: false } });
            }
        });
        t.list.field('posts', {
            type: 'Post',
            resolve(_root, _args, ctx) {
                return ctx.db.post.findMany({ where: { published: true } });
            },
        })
    },
});

export const PostMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createDraft', {
            type: 'Post',
            args: {
                title: nonNull(stringArg()),
                body: nonNull(stringArg()),
            },
            resolve(parent, args, context, info) {
                const draft = {
                    title: args.title,
                    body: args.body,
                    published: false
                }
                return context.db.post.create({data: draft})
            },
        });
        t.field('publish', {
           type: 'Post',
           args: {
               draftId: nonNull(intArg()),
           },
            resolve(parent, args, context, info) {
               return context.db.post.update({
                   where: { id: args.draftId },
                   data: { published: true },
               });
            }
        });
    },
})