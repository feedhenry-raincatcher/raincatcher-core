// Reference mocha-typescript's global definitions:
/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />

import {suite,test} from 'mocha-typescript';
import {PassportSetup} from '../src/auth/PassportSetup';
import {UserSec,UserSecService} from '../src/user/UserSec';
import {BaseUser}  from '../src/user/BaseUser';
import * as TypeMoq from 'typemoq';


import * as express from 'express';
import * as assert from 'assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

@suite
class PassportSetupTest {

    private userSecServiceMock : TypeMoq.IMock<UserSecService<BaseUser>> = TypeMoq.Mock.ofType<UserSecService<BaseUser>>();
    private passportSetup : PassportSetup<BaseUser> = new PassportSetup(this.userSecServiceMock.object);

    public static before(){
        let chai = require('chai');
        chai.should();
    }

    public before(){
        this.userSecServiceMock.reset();
        this.passportSetup = new PassportSetup(this.userSecServiceMock.object);
    }

    @test
    public testInitShouldInitializeFunctions(){
        let expressAppMock: TypeMoq.IMock<express.Express> = TypeMoq.Mock.ofType<express.Express>();
        let passportSetupMock: TypeMoq.IMock<PassportSetup<BaseUser>> = TypeMoq.Mock.ofInstance(this.passportSetup);
        passportSetupMock.callBase = true;
        this.passportSetup = passportSetupMock.object;
        this.passportSetup.init(expressAppMock.object);
        passportSetupMock.verify(passportSetup => passportSetup.setStrategy(), TypeMoq.Times.once())
        passportSetupMock.verify(passportSetup => passportSetup.setSerializeUser(),TypeMoq.Times.once());
        passportSetupMock.verify(passportSetup => passportSetup.setDeserializeUser(), TypeMoq.Times.once());
    }

}