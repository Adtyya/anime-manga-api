import cheerio from 'cheerio';
import axios from "axios";
import express from "express";
import request from 'request-promise';

const app = express();
const PORT = process.env.PORT || 5000;

const getPage = 'https://komikindo.id/daftar-komik/page';
const getDetail = 'https://komikindo.id/komik';
const getRead = 'https://komikindo.id';

app.use(express.json());
app.get('/', (req, res)=> {
  res.send('<h1>Halo</h1>');
})
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

app.get('/halaman/:number', async (req,res)=>
{
  const {number} = req.params;
  try {
    const response = await request(`${getPage}/${number}`);
    // const body = await response.data;
    const $ = cheerio.load(response);
    const arr = []
    const file = $('.animepost')
    .children()
    .map(function()
    {
      const obj ={name:"", poster:""}
      obj.name =  $(this).find('h4').text();
      obj.poster = $(this).find('img').attr('src');
      arr.push(obj);
    })
    res.json(arr);

  } catch (error) {
    res.send('not found')
  }
});

app.get('/detail/:judul', async (req,res)=>
{
  const {judul} = req.params;
  try {
    const response = await request(`${getDetail}/${judul}`);
    // const body = await response.data;
    const $ = cheerio.load(response);
    const getGenre = [];
    const getChapter = [];
    const detail = {title:"", sinopsis:"", isiSinopsis: "", genre: getGenre, chapterList: getChapter}
    detail.title = $('.entry-title').text();
    detail.sinopsis = $('.widget-title').children('h2').text();
    detail.isiSinopsis = $('.entry-content.entry-content-single').children('p').text();
    const genre = $('.genre-info a').each(function(){
      const obj = {genre: ""};
      obj.genre = $(this).text();
      getGenre.push(obj)
    })
    const chList = $('#chapter_list .lchx a').each(function(){
      const obj = {link: "", chName: ""};
      obj.chName = $(this).text();
      obj.link = $(this).attr('href').slice(21);
      getChapter.push(obj) 
    });
    res.send(detail);
  } catch (error) {
    res.send(error)
  }
});

app.get('/read/:judul', async (req,res)=>{
  const {judul} = req.params;
  try {
    const response = await request(`${getRead}/${judul}`);
    // const body = await response.data;
    const $ = cheerio.load(response);
    const getImg = [];
    const detail = {src: getImg}
    const genre = $('#chimg-auh img').each(function(){
      const obj = {img: ""};
      obj.img = $(this).attr('src');
      getImg.push(obj)
    })
    res.send(detail)

  } catch (error) {
    res.send(error)
  }

})
