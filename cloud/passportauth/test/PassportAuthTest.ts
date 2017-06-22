import {PassportAuth} from '../src/auth/PassportAuth';
import {BaseUser} from '../src/user/BaseUser';
import {UserSec,UserSecService} from '../src/user/UserSec';

import {suite,test} from 'mocha-typescript';
import * as TypeMoq from 'typemoq';
import * as express from 'express';

import {expect} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as passport from 'passport';
import * as proxyquire from 'proxyquire';

@suite
class PassportAuthTest {

    private passportMock: TypeMoq.IMock<passport.Passport> = TypeMoq.Mock.ofType<passport.Passport>();
    private userSecServiceMock : TypeMoq.IMock<UserSecService<BaseUser>> = TypeMoq.Mock.ofType<UserSecService<BaseUser>>();
    private passportAuth: PassportAuth<BaseUser> = new PassportAuth(this.userSecServiceMock.object);

    public static before(){
        let chai = require('chai');
        chai.use(chaiAsPromised);
    }
    
    @test
    public testIsAuthenticatedWithAuthenticatedRequest(){
        let authenticatedRequest: TypeMoq.IMock<express.Request> = TypeMoq.Mock.ofType<express.Request>();
        authenticatedRequest.setup(request => request.isAuthenticated()).returns(() => true);
        expect(this.passportAuth.isAuthenticated(authenticatedRequest.object)).to.equal(true);
    }

    @test
    public testIsAuthenticatedWithNotAuthenticatedRequest(){
        let notAuthenticatedRequest: TypeMoq.IMock<express.Request> = TypeMoq.Mock.ofType<express.Request>();
        notAuthenticatedRequest.setup(request => request.isAuthenticated()).returns(() => true);
        expect(this.passportAuth.isAuthenticated(notAuthenticatedRequest.object)).to.equal(true);
    }

    @test
    public testGetUserProfileExistingUser(){
        let existingUser: BaseUser = {
            id: '007',
            username: 'James Bond',
            password: 'GoldenEye',
            roles: ['MI6']

        }
        this.userSecServiceMock.setup(userService => userService.getProfileData("007")).returns(() => Promise.resolve(existingUser));
        return expect(this.passportAuth.getUserProfile("007")).to.eventually.equal(existingUser);
    }

    @test
    public testGetProfileNotExistingUser(){
        return expect(this.passportAuth.getUserProfile("000")).to.eventually.equal({});
    }

    @test
    public testLogout(){
        let expressRequestMock: TypeMoq.IMock<express.Request> = TypeMoq.Mock.ofType<express.Request>();
        this.passportAuth.logout(expressRequestMock.object);
        expressRequestMock.verify(request => request.logout(), TypeMoq.Times.once());
    }


    @test
    public testLoginWithoutOpts(){
        let loginStrategy: string = 'Hello World!';
        let passportAuthProxy = proxyquire('../src/auth/PassportAuth',{'passport': this.passportMock.object});
        this.passportAuth = new passportAuthProxy.PassportAuth(this.userSecServiceMock.object);
        this.passportAuth.login(loginStrategy);
        this.passportMock.verify(passport => passport.authenticate(loginStrategy,{}), TypeMoq.Times.once());
    }
}