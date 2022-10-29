import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as compress from 'compression';
import { PrismaService } from '../src/prisma/prisma.service';
describe('App:(e2e)', () => {
  let app: INestApplication;
  let prismaService : PrismaService
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
      }),
    );
    app.use(helmet());
    app.use(hpp());
    app.use(compress());         
    await app.init();  
    prismaService = app.get(PrismaService)    
    await prismaService.cleanDB()   
  });
  afterAll(()=>{ 
  app.close()
  });
  describe("Auth:(e2e)",()=>{
    // signup
    describe("signup",()=>{
      it("POST '/auth/signup' email not valid",()=>{
        return request(app.getHttpServer()).post('/auth/signup').send({
          first_name:"firstname",
          last_name:"lastname",
          email:"email",
          password:"password"
        }).expect(400)
      })
      it("POST '/auth/signup' felids messing",()=>{
        return request(app.getHttpServer()).post('/auth/signup').send({          
          password:"password"
        }).expect(400)
      })
      it("POST '/auth/signup' with extra felids ",()=>{
        return request(app.getHttpServer()).post('/auth/signup').send({          
          first_name:"firstname",
          last_name:"lastname",
          email:"email@gmail.com",
          password:"password",
          "exta":"24343"
        }).expect(400)
      })
      it("POST '/auth/signup' new user",()=>{
        return request(app.getHttpServer()).post('/auth/signup').send({
          first_name:"firstname",
          last_name:"lastname",
          email:"email@gmail.com",
          password:"password"
        }).expect(200)
      })
      it("POST '/auth/signup' user conflit",()=>{
        return request(app.getHttpServer()).post('/auth/signup').send({
          first_name:"firstname",
          last_name:"lastname",
          email:"email@gmail.com",
          password:"password"
        }).expect(409)
      })
      
    })
    //login
    describe("login",()=>{
     it("Post '/auth/login' vaild",()=>{
      return request(app.getHttpServer()).post('/auth/login').send({        
        email:"email@gmail.com",
        password:"password"
      }).expect(200)
     })
     it("Post '/auth/login' not vaild",()=>{
      return request(app.getHttpServer()).post('/auth/login').send({        
        email:"email",
        password:"password2"
      }).expect(400)
     })
     it("Post '/auth/login' not vaild",()=>{
      return request(app.getHttpServer()).post('/auth/login').send({        
        email:"email",      
      }).expect(400)
     })
    })
  })

});

