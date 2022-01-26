import cheerio from 'cheerio';
import axios from "axios";
import request from 'request-promise';

const main = async ()=>
{
    const response = await request(`https://komikindo.id/aida-ni-hatachi-chapter-4/`);
    // const body = await response.data;
    const $ = cheerio.load(response);
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