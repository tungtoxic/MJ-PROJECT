const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bio = require("./models/Bio");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔌 Đã kết nối MongoDB để nạp Tiểu sử..."))
  .catch((err) => {
    console.error("Lỗi:", err);
    process.exit(1);
  });

const bioData = [
  {
    chapterId: 1,
    year: "1958 - 1968",
    title: "Đứa trẻ thành phố Thép",
    image: "/images/biography/bio_childhood.jpg",
    content: [
      "Michael Joseph Jackson cất tiếng khóc chào đời vào đêm 29/8/1958 tại Gary, Indiana. Ông là người con thứ 8 trong một gia đình lao động da màu chật vật mưu sinh. Cả gia đình 11 người phải sống chen chúc trong căn nhà nhỏ bé chỉ có 2 phòng ngủ tại số 2300 phố Jackson.",
      "Cha ông, Joe Jackson, là một công nhân vận hành cần cẩu tại nhà máy thép nhưng mang trong mình giấc mơ âm nhạc dang dở. Ông cai trị gia đình bằng kỷ luật sắt đá. Michael và các anh em thường xuyên bị đánh đòn bằng dây điện hoặc thắt lưng nếu hát sai nhịp hoặc nhảy sai bước trong các buổi tập khắc nghiệt kéo dài hàng giờ đồng hồ mỗi ngày.",
      "Tuy nhiên, chính sự khắc nghiệt đó đã mài giũa nên một viên ngọc. Năm 5 tuổi, Michael lần đầu tiên hát trước công chúng bài 'Climb Ev'ry Mountain' tại trường học. Giọng hát trong trẻo, đượm buồn và phong thái tự tin đến kinh ngạc của cậu bé đã khiến các giáo viên bật khóc. Huyền thoại bắt đầu từ đó, đánh đổi bằng một tuổi thơ không bao giờ trọn vẹn.",
    ],
  },
  {
    chapterId: 2,
    year: "1969 - 1978",
    title: "Hào quang & Nỗi cô đơn",
    image: "/images/biography/bio_jackson5.jpg",
    content: [
      "Năm 1969, định mệnh gõ cửa. The Jackson 5 ký hợp đồng với hãng đĩa huyền thoại Motown Records. Michael, khi đó mới 11 tuổi, đã trở thành linh hồn của nhóm. Họ lập kỷ lục Guinness khi 4 đĩa đơn đầu tiên ('I Want You Back', 'ABC', 'The Love You Save', 'I'll Be There') liên tiếp leo lên vị trí số 1 bảng xếp hạng Billboard - điều chưa từng có tiền lệ.",
      "Thế giới phát cuồng vì cậu bé có mái tóc xù Afro và những bước nhảy điêu luyện như James Brown thu nhỏ. Michael trở thành siêu sao nhí toàn cầu. Nhưng đằng sau ánh đèn sân khấu rực rỡ là sự cô đơn tột cùng. Michael lớn lên trong những chiếc vali, nhìn ngắm thế giới qua cửa kính xe hơi và khách sạn, không có bạn bè cùng trang lứa, không có những trò chơi trẻ thơ.",
      "Giai đoạn dậy thì là cơn ác mộng. Michael bị mụn trứng cá nặng và bắt đầu thay đổi giọng nói. Ông chịu đựng sự chế giễu tàn nhẫn từ chính cha mình về chiếc mũi to. Sự tự ti về ngoại hình bắt đầu hình thành sâu sắc, dẫn đến sự ám ảnh về sự hoàn hảo và phẫu thuật thẩm mỹ sau này. Năm 1978, ông đóng phim 'The Wiz' và gặp Quincy Jones - người thầy sẽ thay đổi cuộc đời ông mãi mãi.",
    ],
  },
  {
    chapterId: 3,
    year: "1979 - 1982",
    title: "Phá kén & Trở thành Vua",
    image: "/images/biography/bio_thriller.jpg",
    content: [
      "Năm 1979 đánh dấu bước ngoặt lịch sử khi Michael hợp tác với Quincy Jones sản xuất album solo 'Off The Wall'. Ông rũ bỏ hình ảnh sao nhí ngây thơ để trở thành một quý ông Disco lịch lãm với bộ vest tuxedo. Album bán được 20 triệu bản, nhưng Michael vẫn chưa hài lòng vì cho rằng nó chưa được công nhận xứng đáng. Ông viết vào nhật ký: 'Tôi sẽ làm việc đến mức không ai có thể phớt lờ tôi nữa'.",
      "Và ông đã giữ lời. Năm 1982, 'Thriller' ra đời như một quả bom nguyên tử văn hóa. Nó trở thành album bán chạy nhất mọi thời đại (hơn 70 triệu bản tính đến nay). Với Thriller, Michael đã một tay phá vỡ rào cản phân biệt chủng tộc trên kênh MTV, mở đường cho các nghệ sĩ da màu sau này.",
      "Khoảnh khắc vĩnh cửu: Đêm 25/3/1983, tại lễ kỷ niệm Motown 25, Michael biểu diễn Billie Jean. Ông ném chiếc mũ phớt, để lộ đôi tất lấp lánh và thực hiện bước trượt lùi Moonwalk lần đầu tiên trên sóng truyền hình quốc gia. 50 triệu khán giả nín thở. Chỉ trong 4 phút, Michael Jackson chính thức đăng quang trở thành Vua nhạc Pop.",
    ],
  },
  {
    chapterId: 4,
    year: "1983 - 1989",
    title: "Quyền lực & Sự lập dị",
    image: "/images/biography/bio_bad.jpg",
    content: [
      "Sau Thriller, Michael trở thành người nổi tiếng nhất hành tinh. Ông không thể bước ra đường mà không gây bạo loạn. Năm 1984, tai nạn bỏng da đầu nghiêm trọng khi quay quảng cáo Pepsi đã mở đầu cho chuỗi ngày phụ thuộc vào thuốc giảm đau để tiếp tục biểu diễn.",
      "Năm 1987, album 'Bad' ra mắt với hình ảnh gai góc, đường phố hơn. Chuyến lưu diễn Bad World Tour kéo dài 16 tháng đã phá vỡ mọi kỷ lục về doanh thu và lượng khán giả. Michael mua lại danh mục bài hát của The Beatles, khẳng định tư duy kinh doanh sắc bén của mình.",
      "Cũng trong giai đoạn này, truyền thông bắt đầu gọi ông là 'Wacko Jacko' vì lối sống lập dị: xây dựng trang trại Neverland thành công viên giải trí, ngủ trong buồng oxy, và kết bạn với tinh tinh Bubbles. Michael dần thu mình lại trong thế giới riêng, nơi ông cảm thấy an toàn hơn là thế giới của người lớn đầy toan tính.",
    ],
  },
  {
    chapterId: 5,
    year: "1990 - 2000",
    title: "Đỉnh cao & Cơn bão",
    image: "/images/biography/bio_dangerous.jpg",
    content: [
      "Thập niên 90 mở màn rực rỡ với album 'Dangerous' và thông điệp 'Heal The World'. Michael trở thành đại sứ hòa bình, đi khắp thế giới để làm từ thiện. Màn trình diễn giữa hiệp Super Bowl 1993 của ông, nơi ông đứng bất động suốt 90 giây, đã thay đổi lịch sử truyền hình Mỹ mãi mãi.",
      "Nhưng năm 1993, cơn ác mộng ập đến. Cáo buộc lạm dụng tình dục trẻ em đầu tiên nổ ra. Dù cảnh sát không tìm thấy bằng chứng và vụ việc được dàn xếp dân sự, hình ảnh trong sáng của ông bị tổn hại nghiêm trọng. Michael suy sụp tinh thần, hủy tour diễn và phải vào trại cai nghiện thuốc giảm đau.",
      "Ông đáp trả thế giới bằng album đôi 'HIStory' (1995) - tác phẩm cá nhân nhất, chứa đựng sự giận dữ và nỗi đau bị phản bội. Ông kết hôn chớp nhoáng với Lisa Marie Presley (con gái Elvis Presley) và sau đó là Debbie Rowe, lần lượt chào đón sự ra đời của Prince và Paris. Làm cha trở thành niềm hạnh phúc lớn nhất của ông.",
    ],
  },
  {
    chapterId: 6,
    year: "2001 - 2008",
    title: "Người cha & Phiên tòa thế kỷ",
    image: "/images/biography/bio_invincible.jpg",
    content: [
      "Michael dành phần lớn thập niên 2000 để tranh đấu với hãng đĩa Sony và làm một người cha đơn thân. Ông luôn che mặt các con bằng mặt nạ khi ra ngoài, không phải vì lập dị, mà để bảo vệ chúng khỏi sự soi mói, để chúng có được tuổi thơ bình thường mà ông chưa từng có.",
      "Năm 2005, Michael phải đối mặt với 'Phiên tòa thế kỷ' với các cáo buộc mới. Sau 5 tháng căng thẳng tột độ, Tòa án tuyên bố ông TRẮNG ÁN với tất cả 14 tội danh. Michael vô tội, nhưng trái tim và niềm tin vào con người của ông đã vỡ vụn.",
      "Kiệt quệ về tài chính và tinh thần, ông rời bỏ Neverland - nơi từng là thiên đường giờ đã bị cảnh sát lục soát tan hoang. Ông sống cuộc đời du mục tại Bahrain, Ireland và Las Vegas, xa lánh ánh hào quang sân khấu.",
    ],
  },
  {
    chapterId: 7,
    year: "2009 - Mãi mãi",
    title: "Bức màn nhung cuối cùng",
    image: "/images/biography/bio_thisisit.jpg",
    content: [
      "Tháng 3/2009, Michael bất ngờ tuyên bố trở lại với chuỗi 50 buổi diễn 'This Is It' tại London để trả nợ và tri ân khán giả. Vé bán hết sạch trong vài giờ. Ở tuổi 50, ông lao vào tập luyện với cường độ cao để cống hiến những gì tinh túy nhất lần cuối cùng.",
      "Nhưng định mệnh đã không cho phép. Trưa ngày 25/6/2009, Michael Jackson qua đời vì ngộ độc cấp tính propofol do bác sĩ riêng tiêm. Tin tức này đã đánh sập mạng Internet toàn cầu (Google, Twitter đều bị nghẽn). Hàng tỷ người trên thế giới khóc thương cho sự ra đi của một thiên tài.",
      "Michael ra đi, nhưng Di sản của ông là bất tử. Ông để lại một kho tàng âm nhạc vô giá, những chuẩn mực về biểu diễn mà chưa ai vượt qua được, và thông điệp tình yêu 'Heal The World' vẫn còn vang vọng mãi. Ông không chỉ là Vua nhạc Pop, ông là Đấng giải trí vĩ đại nhất mọi thời đại.",
    ],
  },
];

const importData = async () => {
  try {
    await Bio.deleteMany(); // Xóa dữ liệu Bio cũ
    await Bio.create(bioData);
    console.log("✅ ĐÃ NẠP THÀNH CÔNG TIỂU SỬ CHI TIẾT!");
    process.exit();
  } catch (error) {
    console.error("Lỗi:", error);
    process.exit(1);
  }
};

importData();
