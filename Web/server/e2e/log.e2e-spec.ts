import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { LogDTO } from '../src/service/dto/log.dto';
import { LogService } from '../src/service/log.service';

describe('Log Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(LogService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all logs ', async () => {
        const getEntities: LogDTO[] = (await request(app.getHttpServer()).get('/api/logs').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET logs by id', async () => {
        const getEntity: LogDTO = (
            await request(app.getHttpServer())
                .get('/api/logs/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create logs', async () => {
        const createdEntity: LogDTO = (
            await request(app.getHttpServer()).post('/api/logs').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update logs', async () => {
        const updatedEntity: LogDTO = (await request(app.getHttpServer()).put('/api/logs').send(entityMock).expect(201))
            .body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update logs from id', async () => {
        const updatedEntity: LogDTO = (
            await request(app.getHttpServer())
                .put('/api/logs/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE logs', async () => {
        const deletedEntity: LogDTO = (
            await request(app.getHttpServer())
                .delete('/api/logs/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
