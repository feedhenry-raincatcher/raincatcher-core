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

@suite
class PassportSetupTest {

    private static passportSetup : PassportSetup<BaseUser>;

    public static before(){
        let userSecServiceMock : TypeMoq.IMock<UserSecService<BaseUser>> = TypeMoq.Mock.ofType<UserSecService<BaseUser>>();
        this.passportSetup = new PassportSetup(userSecServiceMock.object);
        let chai = require('chai');
        chai.should();
    }

    @test
    public testInit(){
        let expressAppMock: TypeMoq.IMock<express.Express> = TypeMoq.Mock.ofType<express.Express>();
        PassportSetupTest.passportSetup.init(expressAppMock.object);

    }

}