import { InMemoryTaskRepository } from '../src/repositories/InMemoryTaskRepository';
import * as assert from 'assert';
import { Task, BaseTask } from "../../../client/wfm/src/index";

describe('InMemoryTaskRepository Tests',function(){
    let inMemoryTaskRepository: InMemoryTaskRepository;

    describe('#construct',function(){
          it('Should construct repository without any errors',function(){
            inMemoryTaskRepository = new InMemoryTaskRepository();
            assert.ok(inMemoryTaskRepository);
        });
        it('Should construct repository with no tasks',function(){
            inMemoryTaskRepository = new InMemoryTaskRepository();
            inMemoryTaskRepository.getAll().then(tasks => {
                assert.equal(tasks.length,0);
            })
        });
        it('Should construct repository with expected amount of tasks',function(){
            let tasks: Task[] = [];
            for (let i = 0; i < 10; ++i){
                tasks.push(new BaseTask());
            }
            inMemoryTaskRepository = new InMemoryTaskRepository(tasks);
            inMemoryTaskRepository.getAll().then(tasks => {
                assert.equal(tasks.length,10);
            });
        });
    });

    describe('#reset',function(){
        let seedData: Task[] = [new BaseTask(), new BaseTask(), new BaseTask()];
        
        it('Should reset empty task repository correctly',function(){
            inMemoryTaskRepository = new InMemoryTaskRepository();
            inMemoryTaskRepository.reset();
            inMemoryTaskRepository.getAll().then(tasks => {
                assert.equal(tasks.length,0);
            });
        });

        it('Should reset non-empty task repository correctly', function(){
            inMemoryTaskRepository = new InMemoryTaskRepository(seedData);
            inMemoryTaskRepository.reset();
            inMemoryTaskRepository.getAll().then(tasks => {
                assert.equal(tasks.length,seedData.length);
                assert.deepEqual(tasks,seedData);
            });
        })

        it('Should reset to seed data correctly after creating tasks',function(){
            inMemoryTaskRepository = new InMemoryTaskRepository(seedData);
            inMemoryTaskRepository.createMany([new BaseTask(), new BaseTask()]);
            inMemoryTaskRepository.reset();
            inMemoryTaskRepository.getAll().then(tasks => {
                assert.equal(tasks.length,seedData.length);
                assert.deepEqual(tasks,seedData);
            });
        })

    });

    describe('#createMany',function(){
        it('Should create tasks correctly on empty task repository',function(){
            inMemoryTaskRepository = new InMemoryTaskRepository();
            inMemoryTaskRepository.createMany([new BaseTask(), new BaseTask()]);
            inMemoryTaskRepository.getAll().then(tasks => {
                assert.equal(tasks.length,2);
            });
        });
        it('Should create tasks correctly on non-empty task repository',function(){
            inMemoryTaskRepository = new InMemoryTaskRepository([new BaseTask(), new BaseTask()]);
            inMemoryTaskRepository.createMany([new BaseTask(), new BaseTask()]);
            inMemoryTaskRepository.getAll().then(tasks => {
                assert.equal(tasks.length,4);
            });
        });
        it('Should create tasks succesfully after reset', function(){
            inMemoryTaskRepository = new InMemoryTaskRepository([new BaseTask(), new BaseTask()]);
            inMemoryTaskRepository.createMany([new BaseTask(), new BaseTask()]);
            inMemoryTaskRepository.reset();
            inMemoryTaskRepository.createMany([new BaseTask()]);
            inMemoryTaskRepository.getAll().then(tasks => {
                assert.equal(tasks.length,3);
            });
        });
    });
});