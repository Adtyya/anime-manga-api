import cheerio from 'cheerio';
import axios from "axios";

const main = async ()=>
{
    const response = await axios.get(`https://komikindo.id/aida-ni-hatachi-chapter-4/`);
    const body = await response.data;
    const $ = cheerio.load(body);
    const getImg = [];
    const detail = {src: getImg}
    const genre = $('#chimg-auh img').each(function(){
            const obj = {img: ""};
            obj.img = $(this).attr('src');
            getImg.push(obj)
        })
    console.log(detail);
}
main();