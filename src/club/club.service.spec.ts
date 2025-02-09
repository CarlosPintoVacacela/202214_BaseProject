import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[]
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubList = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await repository.save({
        nombre: faker.company.name(),
        fechaFundacion: faker.company.name(),
        imagen: faker.company.name(),
        descripcion: faker.company.name(),
        })
        clubList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubes', async () => {
    const clubes: ClubEntity[] = await service.findAll();
    expect(clubes).not.toBeNull();
    expect(clubes).toHaveLength(clubList.length);
  });


  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre)
    expect(club.fechaFundacion).toEqual(storedClub.fechaFundacion)
    expect(club.imagen).toEqual(storedClub.imagen)
    expect(club.descripcion).toEqual(storedClub.descripcion)
  
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El club con el id especificado no existe")
  });


  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: "",
      nombre: faker.company.name(),
      fechaFundacion: faker.company.name(),
      imagen: faker.company.name(),
      descripcion: faker.company.name(),
      socios:[]
    }
 
    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();
 
    const storedClub: ClubEntity = await repository.findOne({where: {id: newClub.id}})
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newClub.nombre)
    expect(storedClub.fechaFundacion).toEqual(newClub.fechaFundacion)
    expect(storedClub.imagen).toEqual(newClub.imagen)
    expect(storedClub.descripcion).toEqual(newClub.descripcion)
  });

  
  it('update should modify a club', async () => {
    const club: ClubEntity = clubList[0];
    club.nombre = "New name";
     const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
     const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre)
    expect(storedClub.fechaFundacion).toEqual(club.fechaFundacion)
    expect(storedClub.imagen).toEqual(club.imagen)
    expect(storedClub.descripcion).toEqual(club.descripcion)
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, nombre: "New name", fechaFundacion: "2022-10-11", imagen: "New image", descripcion: "New descripcion"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "El club con el id especificado no existe")
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
     const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El club con el id especificado no existe")
  });

});
