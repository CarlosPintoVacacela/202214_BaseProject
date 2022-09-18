import { Test, TestingModule } from '@nestjs/testing';
import { ClubSocioService } from './club-socio.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let socioList : SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();
 
    socioList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await socioRepository.save({
          nombreUsuario:faker.company.name(),
          correo:faker.company.name(),
          fechaNacimiento:faker.company.name()
        })
        socioList.push(socio);
    }
 
    club = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.company.name(),
      imagen: faker.company.name(),
      descripcion: faker.company.name(),
      socios: socioList
    })
  }



  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add a socio to a club', async () => {
    const newsocio: SocioEntity = await socioRepository.save({
          nombreUsuario:faker.company.name(),
          correo:faker.company.name(),
          fechaNacimiento:faker.company.name()
    });
 
    const newclub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.company.name(),
      imagen: faker.company.name(),
      descripcion: faker.company.name()
    })
 
    const result: ClubEntity = await service.addMemberToClub(newclub.id, newsocio.id);
   
    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombreUsuario).toBe(newsocio.nombreUsuario)
    expect(result.socios[0].correo).toBe(newsocio.correo)
    expect(result.socios[0].fechaNacimiento).toBe(newsocio.fechaNacimiento)
  });

  it('addMemberToClub should thrown exception for an invalid socio', async () => {
    const newclub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.company.name(),
      imagen: faker.company.name(),
      descripcion: faker.company.name()
    })
 
    await expect(() => service.addMemberToClub(newclub.id, "0")).rejects.toHaveProperty("message", "El socio con el id especificado no existe");
  });


  it('addMemberToClub should throw an exception for an invalid club', async () => {
    const newsocio: SocioEntity = await socioRepository.save({
          nombreUsuario:faker.company.name(),
          correo:faker.company.name(),
          fechaNacimiento:faker.company.name()
    });
 
    await expect(() => service.addMemberToClub("0", newsocio.id)).rejects.toHaveProperty("message", "El club con el id especificado no existe");
  });

  it('findMemberFromClub should return socio by club', async () => {
    const socio: SocioEntity = socioList[0];
    const storedsocio: SocioEntity = await service.findMemberFromClub(club.id, socio.id, )
    expect(storedsocio).not.toBeNull();
    expect(storedsocio.nombreUsuario).toBe(socio.nombreUsuario);
    expect(storedsocio.correo).toBe(socio.correo);
    expect(storedsocio.fechaNacimiento).toBe(socio.fechaNacimiento);
  });

  it('findMemberFromClub should throw an exception for an invalid socio', async () => {
    await expect(()=> service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "El socio con el id especificado no existe");
  });

  it('findMemberFromClub should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = socioList[0];
    await expect(()=> service.findMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "El club con el id especificado no existe");
  });

  it('findMemberFromClub should throw an exception for an socio not associated to the club', async () => {
    const newsocio: SocioEntity = await socioRepository.save({
          nombreUsuario:faker.company.name(),
          correo:faker.company.name(),
          fechaNacimiento:faker.company.name()
    });
 
    await expect(()=> service.findMemberFromClub(club.id, newsocio.id)).rejects.toHaveProperty("message", "El socio con el id especificado no esta asociada con el club");
  });

  it('findMembersFromClub should return socio by club', async ()=>{
    const socio: SocioEntity[] = await service.findMembersFromClub(club.id);
    expect(socio.length).toBe(5)
  });

  it('findMembersFromClub should throw an exception for an invalid club', async () => {
    await expect(()=> service.findMembersFromClub("0")).rejects.toHaveProperty("message", "El club con el id especificado no existe");
  });

  it('updateMembersFromClub should update socio list for a club', async () => {
    const newsocio: SocioEntity = await socioRepository.save({
          nombreUsuario:faker.company.name(),
          correo:faker.company.name(),
          fechaNacimiento:faker.company.name()
    });
 
    const updatedclub: ClubEntity = await service.updateMembersFromClub(club.id, [newsocio]);
    expect(updatedclub.socios.length).toBe(1);
    expect(updatedclub.socios[0].nombreUsuario).toBe(newsocio.nombreUsuario);
    expect(updatedclub.socios[0].correo).toBe(newsocio.correo);
    expect(updatedclub.socios[0].fechaNacimiento).toBe(newsocio.fechaNacimiento);
  });


  it('updateMembersFromClub should throw an exception for an invalid club', async () => {
    const newsocio: SocioEntity = await socioRepository.save({
          nombreUsuario:faker.company.name(),
          correo:faker.company.name(),
          fechaNacimiento:faker.company.name()
    });
 
    await expect(()=> service.updateMembersFromClub("0", [newsocio])).rejects.toHaveProperty("message", "El club con el id especificado no existe");
  });

  it('updateMembersFromClub should throw an exception for an invalid socio', async () => {
    const newsocio: SocioEntity = socioList[0];
    newsocio.id = "0";
 
    await expect(()=> service.updateMembersFromClub(club.id, [newsocio])).rejects.toHaveProperty("message", "El socio con el id especificado no existe");
  });

  it('deletesocioToclub should remove an socio from a club', async () => {
    const socio: SocioEntity = socioList[0];
   
    await service.deleteMemberFromClub(club.id, socio.id);
 
    const storedclub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});
    const deletedsocio: SocioEntity = storedclub.socios.find(a => a.id === socio.id);
 
    expect(deletedsocio).toBeUndefined();
 
  });

  it('deletesocioToclub should thrown an exception for an invalid socio', async () => {
    await expect(()=> service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "El socio con el id especificado no existe");
  });

  it('deletesocioToclub should thrown an exception for an invalid club', async () => {
    const socio: SocioEntity = socioList[0];
    await expect(()=> service.deleteMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "El club con el id especificado no existe");
  });

  it('deletesocioToclub should thrown an exception for an non asocciated socio', async () => {
    const newsocio: SocioEntity = await socioRepository.save({
          nombreUsuario:faker.company.name(),
          correo:faker.company.name(),
          fechaNacimiento:faker.company.name()
    });
 
    await expect(()=> service.deleteMemberFromClub(club.id, newsocio.id)).rejects.toHaveProperty("message", "El socio con el id especificado no esta asociada con el club");
  });

});
