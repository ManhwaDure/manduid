import Router from '@koa/router';
import { Next, Context, DefaultState, ParameterizedContext } from 'koa';
import { OidcClient } from '../../models/oidc/OidcClient';
import bodyParser from 'koa-bodyparser';
import randomstring from 'randomstring'
import { Member } from '../../models/Member';
import { FindOptions, WhereOptions, Op, IncludeOptions } from 'sequelize';
import { checkPermission } from './middleware';

let router = new Router<DefaultState, Context & ParameterizedContext>();
router.get('/', checkPermission('oidc.list'), async (ctx: Context) => {
    let clients = await OidcClient.findAll();
    await ctx.render('admin/oidc/list', {clients});
});
router.get('/delete/:clientId', checkPermission('oidc.delete'), async (ctx: Context & ParameterizedContext) => {
    let client = await OidcClient.findByPk(ctx.params.clientId);
    if (client) {
        await client.destroy();
        await ctx.render('admin/oidc/list', {clients: await OidcClient.findAll(), message: '삭제 완료'});
    } else {
        await ctx.render('admin/oidc/list', {clients: await OidcClient.findAll(), error: '존재하지 않는 OIDC Client입니다.'});
    }
});
router.post('/create', checkPermission('oidc.create'), bodyParser(), async (ctx: Context) => {
    let {client_name, redirect_uris} = ctx.request.body;
    let client = {
        client_id: randomstring.generate(15),
        client_secret: randomstring.generate(30),
        client_name,
        redirect_uris: redirect_uris.split('\n')
    }
    await OidcClient.create({id: client.client_id, data: client});
    await ctx.redirect('/admin/oidc');
});
export default router;