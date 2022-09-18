import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { SocioEntity } from './socio.entity';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository< SocioEntity>;
  let socioList: SocioEntity[]
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    socioList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await repository.save({
        nombreUsuario:faker.company.name(),
        correo:faker.company.name(),
        fechaNacimiento:faker.company.name()
        })
        socioList.push(socio);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(socioList.length);
  });


  it('findOne should return a socio by id', async () => {
    const storedSocio: SocioEntity = socioList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.nombreUsuario).toEqual(storedSocio.nombreUsuario)
    expect(socio.correo).toEqual(storedSocio.correo)
    expect(socio.fechaNacimiento).toEqual(storedSocio.fechaNacimiento)
  
  });

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El socio con el id especificado no existe")
  });


  it('create should return a new socio', async () => {
    const socio: SocioEntity = {
      id: "",
      nombreUsuario:faker.company.name(),
      correo:faker.company.name(),
      fechaNacimiento:faker.company.name(),
      clubes: []
    }
 
    const newsocio: SocioEntity = await service.create(socio);
    expect(newsocio).not.toBeNull();
 
    const storedSocio: SocioEntity = await repository.findOne({where: {id: newsocio.id}})
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toEqual(newsocio.nombreUsuario)
    expect(storedSocio.correo).toEqual(newsocio.correo)
    expect(storedSocio.fechaNacimiento).toEqual(newsocio.fechaNacimiento)
  });

  
  it('update should modify a socio', async () => {
    const socio: SocioEntity = socioList[0];
    socio.nombreUsuario = "New name";
     const updatedsocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedsocio).not.toBeNull();
     const storedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toEqual(socio.nombreUsuario)
    expect(storedSocio.correo).toEqual(socio.correo)
    expect(storedSocio.fechaNacimiento).toEqual(socio.fechaNacimiento)
  });

  it('update should throw an exception for an invalid socio', async () => {
    let socio: SocioEntity = socioList[0];
    socio = {
      ...socio, nombreUsuario: "New name", correo: "correo@gmail.com", fechaNacimiento: "2020-10-14"
    }
    await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "El socio con el id especificado no existe")
  });

  it('delete should remove a socio', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
     const deletedsocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(deletedsocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El socio con el id especificado no existe")
  });
});
