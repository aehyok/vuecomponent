<template>
  <div>
    <div id="map"></div>
    <div class="calculation-box">
      <p>Draw a polygon using the draw tools.</p>
      <div id="calculated-area"></div>
    </div>
  </div>
</template>

<script>
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import turf from '@turf/turf'
const mapboxgl = require('mapbox-gl')

export default {
  name: 'mapboxgl',
  mounted() {
    this.initmap()
  },

  // 显示多边形  http://www.mapbox.cn/mapbox-gl-js/example/geojson-polygon/

  methods: {
    initmap() {
      mapboxgl.accessToken =
        'pk.eyJ1IjoicGxheS1pc2FhYyIsImEiOiJjazU0cDkzbWowamd2M2dtemd4bW9mbzRhIn0.cxD4Fw3ZPB_taMkyUSFENA'
      var map = new mapboxgl.Map({
        container: 'map', // container id 绑定的组件的id
        style: 'mapbox://styles/mapbox/streets-v11', // 地图样式，可以使用官网预定义的样式,也可以自定义
        center: [118.726533, 32.012005], // 初始坐标系
        zoom: 24, // starting zoom 地图初始的拉伸比例
        pitch: 60, // 地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
        bearing: -17.6, // 地图的初始方向，值是北的逆时针度数，默认是0，即是正北
        antialias: true, // 抗锯齿，通过false关闭提升性能
      })
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          line_string: true,
          point: true,
          trash: true,
        },
      })
      map.addControl(draw)

      map.on('draw.create', updateArea)
      map.on('draw.delete', updateArea)
      map.on('draw.update', updateArea)

      function updateArea(e) {
        var data = draw.getAll()
        console.log(data, 'this.draw.data')
        var answer = document.getElementById('calculated-area')
        if (data.features.length > 0) {
          var area = turf.area(data)
          // restrict to area to 2 decimal points
          var roundedArea = Math.round(area * 100) / 100
          answer.innerHTML =
            '<p><strong>' + roundedArea + '</strong></p><p>square meters</p>'
        } else {
          answer.innerHTML = ''
          if (e.type !== 'draw.delete')
            alert('Use the draw tools to draw a polygon!')
        }
      }

      // The 'building' layer in the mapbox-streets vector source contains building-height
      // data from OpenStreetMap.
      map.on('load', function() {
        // on设置监听，以及触发时的回调，这是加载时的触发的生成3d地图的例子
        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers
        var labelLayerId
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id
            break
          }
        }

        map.addLayer(
          // 在地图样式中添加一个Mapbox样式图层。(图层，layerid)
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#aaa',

              // use an 'interpolate' expression to add a smooth transition effect to the
              // buildings as the user zooms in
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height'],
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height'],
              ],
              'fill-extrusion-opacity': 0.6,
            },
          },
          labelLayerId,
        )
      })
      // 地图监听点击，触发回调
      map.on('click', function(e) {
        console.log('123', e)
        var marker = new mapboxgl.Marker()
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map)
        console.log(marker)
      })
    },
  },
}
</script>

<style scoped>
@import url('https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css');
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
