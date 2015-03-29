$(function() {
  "use strict";

  //地図のデフォルト値
  var map = L.map("map",{ zoomsliderControl: true,zoomControl: false }).setView([35.65863174　, 139.74542422], 14);

  //OSMレイヤー追加
  L.tileLayer(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ,{
        attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a>",
        maxZoom: 18
      }
      ).addTo(map);

  // スケールバーを追加
  L.control.scale({imperial:false}).addTo(map);


  var markers = new L.FeatureGroup();

  var drawnItems = new L.FeatureGroup().addTo(map);

  // マーカーを置くためののコントローラ
  var drawControl = new L.Control.Draw({
    draw: {
      polyline: {
        shapeOptions:{
          color: '#C3415D',
          opacity: 0.8
        }
      }
      ,polygon: false
      ,rectangle: false
      ,circle: false
      ,marker: {
        repeatMode: true
      }
    }
    ,edit: {
      featureGroup: drawnItems
    }
    ,position: 'topright'
  }).addTo(map);

  map.on('draw:created', function(e) {
      drawnItems.addLayer(e.layer);
  });


  // 地図を動かしたときに緯度経度を表示する。
  map.on("moveend", function(e) {
    setWgsLocation(map.getCenter().lat, map.getCenter().lng);
  });

  $("#reload").on("click", function() {

    if (map.hasLayer(markers)) {
      map.removeLayer(markers);
      markers = new L.FeatureGroup();
    }

    $(".points").each(function(cnt, el) {
      var $el = $(el);
      if(!$el.is(":checked")) return;

      $.getJSON("./data/" + $el.attr("id") + ".geojson", function(data) {
        var geojson = L.geoJson(data, {
          onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
          }
        });
        markers.addLayer(geojson);
      });
    });

    map.addLayer(markers);
  });

  // 世界測地系の緯度経度を設定
  function setWgsLocation(lat, lon) {
    var zoom = map.getZoom();
    $("#latlonwgs").val(roundNum(lat) + "," + roundNum(lon) + "　(zoom." + zoom + ")");
  };

  // 小数点8桁に丸め
  function roundNum(value) {
    var num = parseFloat(value) * 100000000;
    num = Math.round(num);
    return (num / 100000000);
  };

});
