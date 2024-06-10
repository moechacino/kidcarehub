import { articleJsonParseUtils } from "../src/api/utils/articleJsonParseUtils";
import { prismaClient } from "../src/config/database";
import bcrypt from "bcrypt";
const addAdmin = async () => {
  const isExist = await prismaClient.admin.findUnique({
    where: {
      username: "admin1",
    },
  });
  if (!isExist) {
    await prismaClient.admin.create({
      data: {
        username: "admin1",
        password: "1234",
      },
    });
  }
};

const addWriter = async () => {
  const data = {
    name: "Sayuti Melik",
    phone: "081234",
    email: "sayuti@gmail.com",
    username: "sayuti",
    password: bcrypt.hashSync("qwerty", 10),
  };

  await prismaClient.writer.create({
    data: data,
  });
};

const addConsultant = async () => {
  const data = {
    name: "Bob",
    email: "bob@gmail.com",
    phone: "0812345",
    username: "bob",
    password: bcrypt.hashSync("qwerty", 10),
    profession: "Dokter Anak",
    photoProfileUrl:
      "https://instagram.fsub9-1.fna.fbcdn.net/v/t51.2885-19/443499280_955905889357006_4091478929963594954_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fsub9-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=wbUXUd__azYQ7kNvgEckZeK&edm=APHcPcMBAAAA&ccb=7-5&oh=00_AYDCBBdesyhRJeuMK4sYzXXFnB6xdlsP3exXA_qc_RAfng&oe=666CF9A6&_nc_sid=cf751b",
    alumnus: "Ono University",
    strNumber: "31.2.02.1.1.23.000123",
    workPlace: "Ngawi, Jawa Timur",
  };

  await prismaClient.consultant.create({
    data: data,
  });
};

const addUser = async () => {
  const data = {
    phone: "0812321",
    name: "Alice",
    password: bcrypt.hashSync("qwerty", 10),
    photoProfile:
      "https://scontent.fsub9-1.fna.fbcdn.net/v/t1.6435-1/74910718_1193858064136419_260154484175405056_n.jpg?stp=dst-jpg_p200x200&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGLjSRAUmjM4kxyAu3WVJ1k5-odb_RqwmLn6h1v9GrCYvW6FMH0NAQn9-q1PxX9xLJOjAmtdNxQ2G-MgfzGxwJP&_nc_ohc=4fHyJpSsxqgQ7kNvgGK7VP0&_nc_ht=scontent.fsub9-1.fna&oh=00_AYCWVjtinWsF91kTdqFU5PZjBFMFE-nZYPFmGOZXuhSaFg&oe=668E9150",
  };

  await prismaClient.user.create({
    data: data,
  });
};

const addArticle = async () => {
  const articleData = [
    {
      createdAt: "2024-04-01",
      title: "TES SATU",
      thumbnail:
        "https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png",
      thumbnail_alt: "cubes-677092_1280.png",
      image: `[
        { "position": 2, "url": "https://cdn.pixabay.com/photo/2016/09/08/18/45/cube-1655118_960_720.jpg", "alt":"cube-1655118_960_720.jpg" },
        { "position": 4, "url": "https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png", "alt":"cubes-677092_1280.png" }
      ]`,
      text: `[
        { "position": 1, "text": "Text ke-1" },
        { "position": 5, "text": "Text ke-5" },
        { "position": 3, "text": "Text ke-3" }
      ]`,
    },
    {
      createdAt: "2024-03-24",
      title: "TES DUA",
      category: "technology",
      thumbnail:
        "https://cdn.pixabay.com/photo/2016/03/05/22/09/abstract-1238654_1280.jpg",
      thumbnail_alt: "abstract-1238654_1280.jpg",
      image: `[
        { "position": 3, "url": "https://cdn.pixabay.com/photo/2016/03/05/22/09/abstract-1238654_1280.jpg", "alt":"abstract-1238654_1280.jpg" },
        { "position": 4, "url": "https://cdn.pixabay.com/photo/2015/09/09/18/03/cube-932526_1280.jpg", "alt":"cube-932526_1280.jpg" }
      ]`,
      text: `[
        { "position": 1, "text": "Text ke-1" },
        { "position": 2, "text": "Text ke-2" }
      ]`,
    },
  ];

  const writer = await prismaClient.writer.findFirst();
  for (let i = 0; i < articleData.length; i++) {
    const thisArticle = articleData[i];
    const article = await prismaClient.article.create({
      data: {
        createdAt: thisArticle.createdAt,
        title: thisArticle.title,
        thumbnail: thisArticle.thumbnail,
        thumbnail_alt: thisArticle.thumbnail_alt,
        writer: { connect: { id: writer?.id } },
      },
    });

    const arrText = articleJsonParseUtils(thisArticle.text);
    const arrImage = articleJsonParseUtils(thisArticle.image);

    const text = await prismaClient.textArticle.createMany({
      data: arrText.map((data) => ({
        position: data.position!,
        text: data.text!,
        articleId: article.id,
        createdAt: article.createdAt,
      })),
    });

    const image = await prismaClient.imageArticle.createMany({
      data: arrImage.map((data) => ({
        position: data.position!,
        url: data.url!,
        alt: data.alt!,
        articleId: article.id,
        createdAt: article.createdAt,
      })),
    });
  }
};

(async () => {
  try {
    await addAdmin();
    await addWriter();
    await addUser();
    await addConsultant();
    await addArticle();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect;
  }
})();
