// 圖片網域位置
const imgUrl = (img)=>{
  let baseUrl
  if (process.env.NODE_ENV === 'production') {
    const protocol = window.location.protocol;
    const host = window.location.host;
    baseUrl = `${protocol}//${host}/`;
    // baseUrl = 'http://sunline.local/';
  } else {
    // baseUrl = 'http://sunline.dboem.com:8088/';
    baseUrl = 'http://sunline.local/';
  }
  
  if(img){
    return `${baseUrl}storage/image/${img}`
  }else{
    return `${baseUrl}storage/image/no_image.png` //沒圖片則使用預設圖
  }
} 


 


export default defineNuxtPlugin(() => {
    return {
      provide: {
        imgUrl,
      }
    }
  })
  