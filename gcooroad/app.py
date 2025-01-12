import streamlit as st
import requests
import json
import streamlit.components.v1 as components
import openai

# ===================================
#             CONFIG
# ===================================
GOOGLE_API_KEY = "google-api-key"
openai.api_key = "opeani-api-key"


# ===================================
#    Helper: OpenAI API Function
# ===================================
def get_short_description_kor(place):
    """
    Calls the OpenAI API with a custom prompt in Korean to return a single-sentence,
    tourism recommendation for the given place, using name, time, and address.
    """
    name = place["name"]
    address = place["address"]
    time_str = f"{int(place['time'])}분"

    system_prompt = "너는 여행 가이드 역할을 맡은 AI야."
    user_prompt = f"""너는 여행 가이드 역할을 맡은 AI야. 아래 [데이터]에 있는 장소의 이름, 이동 시간, 주소를 참고하여, 해당 장소를 추천하는 이유를 한 문장으로 작성해줘. 문장은 자연스러운 한국어로 작성하며, 장소의 매력과 특징을 간결하고 설득력 있게 구체적으로 설명해줘. 장소 이름은 빼줘.

    [데이터]
    {name} - {time_str} / {address}

    예시: 방콕을 가로지르는 주요 강으로, 강변을 따라 유람선을 타고 아름다운 경관을 감상할 수 있어요.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=100,
            temperature=0.7
        )
        description = response["choices"][0]["message"]["content"].strip()

    except Exception as e:
        print(e)
        description = "(OpenAI API Error) 설명을 가져올 수 없습니다."
    return description


# ===================================
#  Streamlit App Code
# ===================================
def main():
    st.set_page_config(layout="centered")

    # Your header image
    st.image("public/header.png", width=400)
    
    # Example: Setting latitude/longitude near Bangkok
    latitude = 13.80394
    longitude = 100.54182

    # 1) Put the button and the minutes input side-by-side
    st.markdown("""
        <style>
            /* 전체 컨테이너 스타일 */
            .inline-container {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
                margin-top: 5px;
                margin-left: 5px;
                margin-bottom: 10px;
            }

            /* 숫자 입력 필드 스타일 */
            .inline-input {
                width: 45px;
                text-align: center;
                border: 1px solid #d1d1d1;
                border-radius: 5px;
            }
            
            .button[kind="secondary"] {
                margin-left: 100px;
                font-size: 10px;
            }


        </style>

        <div class="inline-container">
            지쿠와 함께
            <input class="inline-input" type="number" id="minutes" value="25" min="1" /> 
            분 이내로 여행을 떠나봐요!
        </div>
    """, unsafe_allow_html=True)


    # Streamlit에서 사용자 입력 처리
    if "component-value" in st.session_state:
        max_minutes = st.session_state["component-value"]
    else:
        max_minutes = 25  # 기본값 설정

    search_clicked = st.button("갈 수 있는 관광지 찾아보기 🔎")

        # Check if a value has been received from the JavaScript function
    if search_clicked:
        with st.spinner("검색 중... 잠시만 기다려주세요!"):
            # 2) Places API 호출
            places_url = (
                f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
                f"location={latitude},{longitude}&radius=10000&type=tourist_attraction&key={GOOGLE_API_KEY}"
            )
            places_response = requests.get(places_url)
            places_data = places_response.json()

            if "results" in places_data and len(places_data["results"]) > 0:
                # 최대 10개의 관광지만 사용
                top_results = places_data["results"][:10]

                destinations = [
                    f"{place['geometry']['location']['lat']},{place['geometry']['location']['lng']}"
                    for place in top_results
                ]
                destinations_str = "|".join(destinations)

                # Distance Matrix API (mode=walking)
                walking_url = (
                    f"https://maps.googleapis.com/maps/api/distancematrix/json?"
                    f"origins={latitude},{longitude}&destinations={destinations_str}"
                    f"&mode=walking&key={GOOGLE_API_KEY}"
                )
                walking_data = requests.get(walking_url).json()

                # Distance Matrix API (mode=bicycling)
                bicycling_url = (
                    f"https://maps.googleapis.com/maps/api/distancematrix/json?"
                    f"origins={latitude},{longitude}&destinations={destinations_str}"
                    f"&mode=bicycling&key={GOOGLE_API_KEY}"
                )
                bicycling_data = requests.get(bicycling_url).json()

                valid_places = []
                for idx, place in enumerate(top_results):
                    elem_walk = walking_data["rows"][0]["elements"][idx]
                    elem_bike = bicycling_data["rows"][0]["elements"][idx]

                    # 킥보드 시간 추정 (자전거 속도 -> /1.25)
                    if elem_bike["status"] == "OK":
                        travel_time_minutes = elem_bike["duration"]["value"] / 60 / 1.25
                    elif elem_walk["status"] == "OK":
                        # 도보 속도를 킥보드 속도의 약 5분의 1로 가정
                        travel_time_minutes = elem_walk["duration"]["value"] / 60 / 5
                    else:
                        continue

                    # 이미지(photo_reference) 처리
                    if "photos" in place and len(place["photos"]) > 0:
                        photo_reference = place["photos"][0].get("photo_reference")
                        image_url = (
                            f"https://maps.googleapis.com/maps/api/place/photo?"
                            f"maxwidth=400&photo_reference={photo_reference}&key={GOOGLE_API_KEY}"
                        )
                    else:
                        image_url = None

                    # 주소
                    address = place.get("vicinity", "(주소 정보 없음)")
                    place_type_list = place.get("types", [])
                    place_type = place_type_list[0] if place_type_list else "정보 없음"

                    # Create place dict
                    place_dict = {
                        "name": place["name"],
                        "address": address,
                        "time": travel_time_minutes,
                        "lat": place["geometry"]["location"]["lat"],
                        "lng": place["geometry"]["location"]["lng"],
                        "image": image_url,
                        "type": place_type,
                    }

                    # OpenAI short description
                    place_dict["description"] = get_short_description_kor(place_dict)

                    # 3) Filter by user-input minutes
                    if travel_time_minutes <= max_minutes:
                        valid_places.append(place_dict)

                # ==============
                # Render the map
                # ==============
                def render_map(valid_places, latitude, longitude, API_KEY):
                    """
                    Renders the HTML for the map:
                      - The user's current location marker is red.
                      - Tourist attraction markers are green pins.
                    """
                    map_html = f"""
                    <html>
                    <head>
                        <meta charset="utf-8" />
                        <style>
                            #map {{
                                width: 380px;
                                height: 380px;
                                margin: 0;
                            }}
                            @media (max-width: 420px) {{
                                #map {{
                                    width: 100%;
                                    height: 600px;
                                    margin: 0;
                                }}
                            }}
                            .info-window-content {{
                                white-space: normal;
                                word-wrap: break-word;
                                max-width: 250px;
                            }}
                            img.place-photo {{
                                width: 100%;
                                height: auto;
                                object-fit: cover;
                                margin-bottom: 5px;
                            }}
                        </style>
                    </head>
                    <body>
                        <div id="map"></div>
                        <script>
                            function initMap() {{
                                var map = new google.maps.Map(document.getElementById('map'), {{
                                    center: {{ lat: 0, lng: 0 }},
                                    zoom: 2
                                }});

                                // Current location marker (red)
                                var centerPos = {{ lat: {latitude}, lng: {longitude} }};
                                var startMarker = new google.maps.Marker({{
                                    position: centerPos,
                                    map: map,
                                    title: "내 위치 (출발지)",
                                    icon: {{
                                        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                        scaledSize: new google.maps.Size(32, 32)
                                    }}
                                }});

                                var bounds = new google.maps.LatLngBounds();
                                bounds.extend(centerPos);

                                // Tourist attractions (green pins)
                                var locations = {json.dumps(valid_places, ensure_ascii=False)};

                                locations.forEach(function(loc) {{
                                    var position = {{ lat: loc.lat, lng: loc.lng }};
                                    var marker = new google.maps.Marker({{
                                        position: position,
                                        map: map,
                                        title: loc.name,
                                        icon: {{
                                            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                            scaledSize: new google.maps.Size(32, 32)
                                        }}
                                    }});

                                    var photoTag = loc.image
                                        ? '<img class="place-photo" src="' + loc.image + '" alt="place photo" />'
                                        : '<p>(No Image)</p>';

                                    var infoContent = ''
                                        + '<div class="info-window-content">'
                                        + '<h3>' + loc.name + '</h3>'
                                        + photoTag
                                        + '<p><strong>' + Math.round(loc.time) + '분</strong>, '
                                        + '<em>' + loc.description + '</em></p>'
                                        + '</div>';

                                    var infoWindow = new google.maps.InfoWindow({{
                                        content: infoContent,
                                        maxWidth: 250
                                    }});

                                    marker.addListener('click', function() {{
                                        infoWindow.open(map, marker);
                                    }});

                                    bounds.extend(position);
                                }});

                                map.fitBounds(bounds);
                            }}
                        </script>
                        <script async
                            src="https://maps.googleapis.com/maps/api/js?key={API_KEY}&callback=initMap">
                        </script>
                    </body>
                    </html>
                    """
                    return map_html

                if valid_places:
                    # 소요 시간 오름차순 정렬
                    valid_places.sort(key=lambda x: x["time"])
                    map_code = render_map(valid_places, latitude, longitude, GOOGLE_API_KEY)
                    components.html(map_code, height=600)
                else:
                    st.warning("❌ 입력한 시간 내에 도달 가능한 관광지가 없습니다.")
            else:
                st.error("API 요청 실패! 입력 값을 확인해 주세요.")


if __name__ == "__main__":
    main()
