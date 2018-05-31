const weatherMap = {
'sunny': '晴天',
'cloudy':'多云',
'overcast':'阴',
'lightrain':'小雨',
'heavyrain':'大雨',
'snow':'雪'
}
const weatherColorMap = {
  'sunny':'#cdeefd',
  'cloudy': '#deeef6',
  'overcast':'#c6ced2',
  'lightrain':'#bdd5e1',
  'heavyrain':'#c5cca0',
  'snow':'#aae1fc'
}
Page({
  data:{
    nowTemp:14,
    nowWeather:'多云',
    nowWeatherBackground:'',
    hourlyWeather:[],
    todayDate:'',
    todayTemp:''
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh();
    });
  },
  onLoad(){
    this.getNow();
  },
getNow(callback){
   wx.request({
     url:'https://test-miniprogram.com/api/weather/now',
     data:{city:'哈尔滨市'},
     success:res => {
    let result = res.data.result;
     this.setNow(result);
     this.setHourlyWeather(result);
     this.setToday(result);
     },
     compulete:()=>{
      callback&&callback();
     }
   })
  },
  setNow(result){
    let temp = result.now.temp;
    let weather = result.now.weather;
    this.setData({
      'nowTemp': temp,
      'nowWeather': weatherMap[weather],
      'nowWeatherBackground': '../../images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourlyWeather(result){
    let forecast = result.forecast;
    let hourlyWeather = [];
    let nowHour = new Date().getHours();
    for (let i = 0; i < forecast.length; i++) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '../../images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在';
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  setToday(result){
    let date = new Date();
    this.setData({
      todayTemp:`${result.today.minTemp}°-${result.today.maxTemp}`,
      todayDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}今天`
    })
  },
  onTapDayWeather(){
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})