import cheerio from 'cheerio';
import axios from "axios";
import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.get('/', (req, res)=> {
  res.send('<h1>API Manga Reader By Aditya Fitriansyah</h1>');
})
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

app.get('/halaman/:number', async (req,res)=>
{
  const {number} = req.params;
  try {
    const response = await axios.get(`https://komikindo.id/daftar-komik/page/${number}`);
    const body = await response.data;
    const $ = cheerio.load(body);
    const file = $('.animepost')
    .children()
    .map(function()
    {
        return{
          name: $(this).find('h4').text(),
          poster: $(this).find('img').attr('src'),
        }

    }).toArray()
    res.json(file);

  } catch (error) {
    
  }
});

app.get('/detail/:judul', async (req,res)=>
{
  const {judul} = req.params;
  try {
    const response = await axios.get(`https://komikindo.id/komik/${judul}`);
    const body = await response.data;
    const $ = cheerio.load(body);
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
    const response = await axios.get(`https://komikindo.id/${judul}`);
    const body = await response.data;
    const $ = cheerio.load(body);
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
