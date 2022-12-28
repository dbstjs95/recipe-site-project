"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 유저
    let userIds = [3, 4, 5, 6, 7, 8, 9, 10];
    let users = userIds.map((id) => ({
      id,
      nickname: `유저${id}`,
      email: `user${id}@gmail.com`,
      external_type: "google",
      external_id: `example_${id}`,
    }));
    await queryInterface.bulkInsert("Users", [
      {
        id: 1,
        nickname: "햄찌마녀",
        email: "yunseon95@gmail.com",
        external_type: "google",
        external_id: "101018419645995209385",
      },
      {
        id: 2,
        nickname: "oo",
        email: "choji95@naver.com",
        external_type: "naver",
        external_id: "0o2ZfzGL-9tcZK2NMGXV1urlmbeqTo753tfTqwax-S8",
      },
      ...users,
    ]);

    // 레시피
    let recipeIds = Array(20)
      .fill(4)
      .map((num, idx) => num + idx);
    let recipes = recipeIds.map((id) => ({
      id,
      user_id: 5,
      public: 1,
      category: "양식,간편식,기타",
      header_img: "upload/test/test1.jpg",
      header_title: `테스트 ${id}번 레시피`,
      header_desc:
        "테스트테스트테스트테스트테스트 테스트테스트테스트 테스트테스트테스트",
      servings: "3인분",
      time: "30분이내",
      level: "초급",
      view: 0,
    }));
    let user1Recipes = Array(20)
      .fill(24)
      .map((id, idx) => ({
        id: id + idx,
        user_id: 1,
        public: 1,
        category: "분식류,다이어트,과일류",
        header_img: "upload/test/test1.jpg",
        header_title: `테스트 ${id + idx}번 레시피`,
        header_desc:
          "테스트테스트테스트테스트테스트 테스트테스트테스트 테스트테스트테스트",
        servings: "2인분",
        time: "15분이내",
        level: "아무나",
        view: 0,
      }));
    await queryInterface.bulkInsert("Recipes", [
      {
        id: 1,
        user_id: 1,
        public: 0,
        category: "양식,간편식,기타",
        header_img: "upload/recipe/e829e02c49b142eab641a11ec80b806d.png",
        header_title: "샌드위치 만들기",
        header_desc: "신선하고 맛있는 정석적인 샌드위치 만드는 법 공유합니다~!",
        servings: "3인분",
        time: "30분이내",
        level: "초급",
        view: 0,
      },
      {
        id: 2,
        user_id: 2,
        public: 1,
        category: "국물류,술안주,채소류",
        header_img: "upload/recipe/32d429669e9547ceacce6ab011f47bf1.png",
        header_title: "찌개 -저녁메인반찬",
        header_desc: "자극적인 짜글이(?)같은 찌개 만들기~~",
        servings: "4인분",
        time: "30분이내",
        level: "아무나",
        view: 0,
      },
      {
        id: 3,
        user_id: 1,
        public: 1,
        category: "퓨전,술안주,버섯류",
        header_img: "upload/recipe/c6b58a7e0c084a29a95a9086e035d444.png",
        header_title:
          "버섯으로 관자 느낌 내는 방법! 새송이버섯간장버터구이 만들기",
        header_desc: "지금까지 이런 버섯은 없었다. 이것은 관자인가 버섯인가",
        servings: "1인분",
        time: "15분이내",
        level: "아무나",
        view: 0,
      },
      ...recipes,
      ...user1Recipes,
    ]);
    await queryInterface.bulkInsert("Recipe_steps", [
      {
        recipe_id: 1,
        order: 1,
        text: "빵을 우선 기름없이 후라이팬에 노릇하게 구워주세요~ 그래야 수분을 흡수해서 흐물하는걸 방지해요.",
        img: "upload/recipe/5181543a10df436da09f3d06d49baf5a.png",
      },
      {
        recipe_id: 1,
        order: 2,
        text: "양파는 얇게 채썰어서 물에 담궈 매운맛을 빼주구요~ 채소는 씻고 토마토는 잘라서 준비해주세요!",
        img: "upload/recipe/49b369a9e1ed441aad678053227a2da6.png",
      },
      {
        recipe_id: 1,
        order: 3,
        text: "계란을 익히는 사이~ 종이호일을 정사각으로 잘라서 5개 준비했어요.",
        img: "upload/recipe/d06a1114d8974b2bae3cc8d7ebde8ee0.png",
      },
      {
        recipe_id: 1,
        order: 4,
        text: "계란은 삶아서 흰자와 노른자를 분리하고, 노른자는 으깨고 흰자는 잘게 썰어주었어요! 그리고 섞어서 마요네즈를 한숟가락만 넣고 비벼주어요~ 살짝쿵 서로 엉긴다는 느낌만 들면 돼요!",
        img: "upload/recipe/cd99273aa2064c328a19c7c1c7218559.png",
      },
      {
        recipe_id: 1,
        order: 5,
        text: "빵위에 마요네즈와 머스터드를 비닐팩에 넣오 이쑤시개로 살짝 뚫어주면 이렇게 나와요. 구운 빵위에 모두 마요네즈와 머스터드를 뿌려주었어요~",
        img: "upload/recipe/326cd466afa140989c8ccc7b8882dafa.png",
      },
      {
        recipe_id: 1,
        order: 6,
        text: "그리고 계란에 소금후추 뿌려서 간 살짝 해주구요~ 소스뿌린 빵위에 계란을 올려주어요. 그리고 치커리나 양상추등 올리고 양파를 올려주세요~",
        img: "upload/recipe/d139dbfb79b44aa483701f95a5fdf471.png",
      },
      {
        recipe_id: 1,
        order: 7,
        text: "양파위에 토마토를 2개씩 올려주었어요~ 그리고 햄을 올려주었는데 슬라이스햄은 얇으니 두개로.",
        img: "upload/recipe/9022f1159b35422bb71d6d945a92bc40.png",
      },
      {
        recipe_id: 1,
        order: 8,
        text: "햄위에 치즈도 한장씩 올려주었어요.",
        img: "upload/recipe/c3a873a466824c83ad3cb09a3eff78e3.png",
      },
      {
        recipe_id: 1,
        order: 9,
        text: "그리고 식빵을 덮으면 끝.",
        img: "upload/recipe/413db9a9985c4a2caf951cdc329e113d.png",
      },
      {
        recipe_id: 1,
        order: 10,
        text: "짠~ 달걀 샌드위치가 완성이네요.",
        img: "upload/recipe/6352ae04fe6e4dab971552cb00747d2f.png",
      },
      {
        recipe_id: 2,
        order: 1,
        text: "찌개에 넣을 각종 재료를 먹기 좋은 크기로 잘라 준비하고",
        img: "upload/recipe/2e262df1adf9440f9b93d93bc1c5d734.png",
      },
      {
        recipe_id: 2,
        order: 2,
        text: "냄비에 찌개에 넣을 재료인 두부,감자,햄,호박,양파,연어캔을 모두 넣고 물을 4컵정도 부어주세요.",
        img: "upload/recipe/3906527e45104ca09da1f822bfdd238d.png",
      },
      {
        recipe_id: 2,
        order: 3,
        text: "고추장1,참치액2를 넣고 보글 보글 끓여 주고 5분정도",
        img: "upload/recipe/f5d634212f29401eb2fc5fcef1d562e9.png",
      },
      {
        recipe_id: 2,
        order: 4,
        text: "그리고 썰어 놓은 김치를 넣고",
        img: "upload/recipe/c497d3e1231f4c5ea031f2d42b8e37cf.png",
      },
      {
        recipe_id: 2,
        order: 5,
        text: "김칫국물 2국자를 넣어주고 보글 보글 끓여 줍니다 15~20분정도",
        img: "upload/recipe/0c4338a3cbb94e91b58842fef2a27fb4.png",
      },
      {
        recipe_id: 2,
        order: 6,
        text: "마지막에 고춧가루1 그리고 대파,청양고추를 넣어 한소끔 더 끓여 마무리 해줍니다.",
        img: "upload/recipe/a0c20be8bfc24fe0a0d5978e5b842e08.png",
      },
      {
        recipe_id: 3,
        order: 1,
        text: "버섯의 밑동과 갓을 잘라낸 뒤, 3~4등분 한다",
        img: "upload/recipe/b997b6f7a98841688bce23ceed14e058.png",
      },
      {
        recipe_id: 3,
        order: 2,
        text: "자른버섯의 양면에 칼집을 낸다",
        img: "upload/recipe/479354af6021454780f4b930cfd02625.png",
      },
      {
        recipe_id: 3,
        order: 3,
        text: "팬에 버터를 녹인다",
        img: "upload/recipe/2abd4db2682341ee87499b9b8f9d3f50.png",
      },
      {
        recipe_id: 3,
        order: 4,
        text: "버섯을 굽는다. 불을 약불로 줄이고 소스를 넣고 졸인다",
        img: "upload/recipe/ad09e2644f954f5bb7ca33f687861476.png",
      },
    ]);
    await queryInterface.bulkInsert("Recipe_ingrs", [
      {
        id: 1,
        recipe_id: 1,
        title: "재료",
      },
      {
        id: 2,
        recipe_id: 2,
        title: "재료",
      },
      {
        id: 3,
        recipe_id: 2,
        title: "양념",
      },
      {
        id: 4,
        recipe_id: 3,
        title: "재료",
      },
      {
        id: 5,
        recipe_id: 3,
        title: "소스재료",
      },
    ]);
    await queryInterface.bulkInsert("Recipe_ingr_details", [
      {
        recipe_ingr_id: 1,
        name: "빵",
        amount: "5쌍",
      },
      {
        recipe_ingr_id: 1,
        name: "치즈",
        amount: "5장",
      },
      {
        recipe_ingr_id: 1,
        name: "햄",
        amount: "5장",
      },
      {
        recipe_ingr_id: 1,
        name: "양파",
        amount: "밥 1공기",
      },
      {
        recipe_ingr_id: 1,
        name: "계란(삶은 것)",
        amount: "밥 1공기",
      },
      {
        recipe_ingr_id: 1,
        name: "각종야채",
        amount: "밥 1공기",
      },
      {
        recipe_ingr_id: 1,
        name: "토마토",
        amount: "빵 1쌍당 4슬라이스",
      },
      {
        recipe_ingr_id: 2,
        name: "연어캔",
        amount: "1개",
      },
      {
        recipe_ingr_id: 2,
        name: "감자작은거",
        amount: "1개",
      },
      {
        recipe_ingr_id: 2,
        name: "스팸큰사이즈",
        amount: "1/2개",
      },
      {
        recipe_ingr_id: 2,
        name: "양파",
        amount: "1/2개",
      },
      {
        recipe_ingr_id: 2,
        name: "두부",
        amount: "1/2모",
      },
      {
        recipe_ingr_id: 2,
        name: "호박",
        amount: "1/3개",
      },
      {
        recipe_ingr_id: 2,
        name: "김치",
        amount: "1.5컵",
      },
      {
        recipe_ingr_id: 2,
        name: "대파",
        amount: "약간",
      },
      {
        recipe_ingr_id: 2,
        name: "청양고추",
        amount: "2개",
      },
      {
        recipe_ingr_id: 2,
        name: "물",
        amount: "4컵 ",
      },
      {
        recipe_ingr_id: 3,
        name: "고추장",
        amount: "1큰술",
      },
      {
        recipe_ingr_id: 3,
        name: "김칫국물",
        amount: "2국자",
      },
      {
        recipe_ingr_id: 3,
        name: "참치액",
        amount: "2큰술",
      },
      {
        recipe_ingr_id: 3,
        name: "고춧가루",
        amount: "1큰술",
      },
      {
        recipe_ingr_id: 4,
        name: "새송이버섯",
        amount: "2개",
      },
      {
        recipe_ingr_id: 4,
        name: "버터",
        amount: "30g",
      },
      {
        recipe_ingr_id: 4,
        name: "어린잎채소",
        amount: "적당히",
      },
      {
        recipe_ingr_id: 5,
        name: "간장",
        amount: "1T",
      },
      {
        recipe_ingr_id: 5,
        name: "맛술",
        amount: "1T",
      },
      {
        recipe_ingr_id: 5,
        name: "올리고당",
        amount: "1/2T",
      },
    ]);

    await queryInterface.bulkInsert("Class_hosts", [
      {
        id: 1,
        name: "김인숙",
        email: "class01@email.com",
        img: "upload/class/1/cook.jpg",
        desc: "안녕하세요. 중화요리연구가 김인숙 입니다.",
      },
      {
        id: 2,
        name: "테스트",
        email: "test@email.com",
        img: "upload/class/test/host.jpg",
        desc: "안녕하세요. 테스트 클래스 호스트입니다. 테스트테스트테스트 테스트테스트 테스트테스트테스트 테스트테스트",
      },
    ]);

    // 클래스
    let classId = Array(20)
      .fill(2)
      .map((num, idx) => num + idx);
    let classes = classId.map((id) => ({
      id,
      host_id: 2,
      category: "양식",
      header_img: "upload/class/test/main.jpg",
      header_title: `양식요리 만들기 테스트 ${id}`,
      header_desc: "다양한 양식요리를 만들어보아요!",
      time_required: 120,
      date_time: `2023-03-0${id} 02:00:00`,
      limit: 20,
      price: 30000,
      place: "경기도 테스트시 테스트구 테스트호",
      intro: "매번 사먹기만 한 양식요리를 직접 만들어 먹는 시간을 가져보아요~",
      deadline: `2023-03-0${id - 1} 23:59:59`,
    }));

    let foods = [
      { name: "고기꼬치", img: "upload/class/test/meat_skewer.jpg" },
      { name: "파스타", img: "upload/class/test/pasta.jpg" },
      { name: "피자", img: "upload/class/test/pizza.jpg" },
    ];

    let classFoods = classId.flatMap((id) => {
      let result = foods.map((item) => ({ class_id: id, ...item }));
      return result;
    });

    await queryInterface.bulkInsert("Classes", [
      {
        id: 1,
        host_id: 1,
        category: "중식",
        header_img: "upload/class/1/main.jpg",
        header_title: "중화요리 만들기 중급반",
        header_desc: "다양한 중화요리를 만들어보아요!",
        time_required: 120,
        date_time: "2023-02-05 02:00:00",
        limit: 26,
        price: 22000,
        place: "경기도 수원시 팔달구 사랑의 집 2층 1호",
        intro:
          "매번 사먹기만 한 중화요리를 직접 만들어 먹는 시간을 가져보아요~",
        deadline: "2023-02-01 13:59:59",
      },
      ...classes,
    ]);
    await queryInterface.bulkInsert("Class_foods", [
      {
        class_id: 1,
        name: "짜장면",
        img: "upload/class/1/짜장면.jpg",
      },
      {
        class_id: 1,
        name: "탕수육",
        img: "upload/class/1/탕수육.jpg",
      },
      ...classFoods,
    ]);

    // 좋아요
    let likes = Array(20)
      .fill(4)
      .map((id, idx) => ({
        user_id: 1,
        recipe_id: id + idx,
      }));

    await queryInterface.bulkInsert("Likes", [...likes]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Recipes", null, {});
    await queryInterface.bulkDelete("Recipe_steps", null, {});
    await queryInterface.bulkDelete("Recipe_ingrs", null, {});
    await queryInterface.bulkDelete("Recipe_ingr_details", null, {});
    await queryInterface.bulkDelete("Class_hosts", null, {});
    await queryInterface.bulkDelete("Classes", null, {});
    await queryInterface.bulkDelete("Class_foods", null, {});
    await queryInterface.bulkDelete("Likes", null, {});
  },
};
