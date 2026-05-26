import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from poetry.models import Category, Poem, Appreciation, Comment


def run():
    print('Initializing data...')

    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print('Created superuser: admin / admin123')

    categories_data = [
        {'name': '唐诗', 'description': '唐代诗歌经典'},
        {'name': '宋词', 'description': '宋代词作品'},
        {'name': '元曲', 'description': '元代表演艺术中的歌曲部分'},
        {'name': '诗经', 'description': '中国最早的诗歌总集'},
        {'name': '楚辞', 'description': '战国时期楚国的诗歌'},
        {'name': '汉赋', 'description': '汉代的赋体文学'},
        {'name': '现代诗', 'description': '现当代诗歌作品'},
    ]

    for cat_data in categories_data:
        Category.objects.get_or_create(name=cat_data['name'], defaults=cat_data)
    print('Created categories')

    admin_user = User.objects.get(username='admin')

    poems_data = [
        {
            'title': '静夜思',
            'author': '李白',
            'dynasty': '唐',
            'content': '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
            'category': '唐诗',
        },
        {
            'title': '春晓',
            'author': '孟浩然',
            'dynasty': '唐',
            'content': '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
            'category': '唐诗',
        },
        {
            'title': '登鹳雀楼',
            'author': '王之涣',
            'dynasty': '唐',
            'content': '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。',
            'category': '唐诗',
        },
        {
            'title': '相思',
            'author': '王维',
            'dynasty': '唐',
            'content': '红豆生南国，春来发几枝。\n愿君多采撷，此物最相思。',
            'category': '唐诗',
        },
        {
            'title': '江雪',
            'author': '柳宗元',
            'dynasty': '唐',
            'content': '千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。',
            'category': '唐诗',
        },
        {
            'title': '水调歌头·明月几时有',
            'author': '苏轼',
            'dynasty': '宋',
            'content': '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。\n转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
            'category': '宋词',
        },
        {
            'title': '念奴娇·赤壁怀古',
            'author': '苏轼',
            'dynasty': '宋',
            'content': '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。\n遥想公瑾当年，小乔初嫁了，雄姿英发。羽扇纶巾，谈笑间，樯橹灰飞烟灭。故国神游，多情应笑我，早生华发。人生如梦，一尊还酹江月。',
            'category': '宋词',
        },
        {
            'title': '声声慢·寻寻觅觅',
            'author': '李清照',
            'dynasty': '宋',
            'content': '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急！雁过也，正伤心，却是旧时相识。\n满地黄花堆积，憔悴损，如今有谁堪摘？守着窗儿，独自怎生得黑！梧桐更兼细雨，到黄昏、点点滴滴。这次第，怎一个愁字了得！',
            'category': '宋词',
        },
        {
            'title': '关雎',
            'author': '佚名',
            'dynasty': '先秦',
            'content': '关关雎鸠，在河之洲。窈窕淑女，君子好逑。\n参差荇菜，左右流之。窈窕淑女，寤寐求之。\n求之不得，寤寐思服。悠哉悠哉，辗转反侧。\n参差荇菜，左右采之。窈窕淑女，琴瑟友之。\n参差荇菜，左右芼之。窈窕淑女，钟鼓乐之。',
            'category': '诗经',
        },
        {
            'title': '蒹葭',
            'author': '佚名',
            'dynasty': '先秦',
            'content': '蒹葭苍苍，白露为霜。所谓伊人，在水一方。\n溯洄从之，道阻且长。溯游从之，宛在水中央。\n蒹葭萋萋，白露未晞。所谓伊人，在水之湄。\n溯洄从之，道阻且跻。溯游从之，宛在水中坻。\n蒹葭采采，白露未已。所谓伊人，在水之涘。\n溯洄从之，道阻且右。溯游从之，宛在水中沚。',
            'category': '诗经',
        },
        {
            'title': '天净沙·秋思',
            'author': '马致远',
            'dynasty': '元',
            'content': '枯藤老树昏鸦，小桥流水人家，古道西风瘦马。夕阳西下，断肠人在天涯。',
            'category': '元曲',
        },
        {
            'title': '再别康桥',
            'author': '徐志摩',
            'dynasty': '近现代',
            'content': '轻轻的我走了，正如我轻轻的来；我轻轻的招手，作别西天的云彩。\n那河畔的金柳，是夕阳中的新娘；波光里的艳影，在我的心头荡漾。\n软泥上的青荇，油油的在水底招摇；在康河的柔波里，我甘心做一条水草！\n那榆荫下的一潭，不是清泉，是天上虹；揉碎在浮藻间，沉淀着彩虹似的梦。\n寻梦？撑一支长篙，向青草更青处漫溯；满载一船星辉，在星辉斑斓里放歌。\n但我不能放歌，悄悄是别离的笙箫；夏虫也为我沉默，沉默是今晚的康桥！\n悄悄的我走了，正如我悄悄的来；我挥一挥衣袖，不带走一片云彩。',
            'category': '现代诗',
        },
    ]

    for poem_data in poems_data:
        category_name = poem_data.pop('category')
        category = Category.objects.get(name=category_name)
        if not Poem.objects.filter(title=poem_data['title'], author=poem_data['author']).exists():
            poem_data['category'] = category
            poem_data['created_by'] = admin_user
            Poem.objects.create(**poem_data)
    print('Created poems')

    appreciations_data = [
        {
            'poem_title': '静夜思',
            'title': '《静夜思》赏析',
            'content': '《静夜思》是唐代诗人李白的代表作之一，也是中国古诗中最广为人知的作品。这首诗以简洁朴素的语言，描绘了诗人在寂静的夜晚对故乡的思念之情。\n\n诗的前两句"床前明月光，疑是地上霜"，通过月光与霜的比喻，营造出清冷孤寂的氛围。诗人将洒落的月光误认为是地上的霜，这一细节既表现了秋夜的寒凉，也暗示了诗人内心的孤寂。\n\n后两句"举头望明月，低头思故乡"是全诗的点睛之笔。诗人抬头望见明月，不由得想起远方的故乡。这一"举"一"低"之间，将诗人对故乡的深切思念表现得淋漓尽致。\n\n全诗语言清新朴素，情感真挚动人，千百年来广为传诵，成为思乡诗中的经典之作。',
        },
        {
            'poem_title': '春晓',
            'title': '《春晓》赏析',
            'content': '《春晓》是唐代诗人孟浩然的经典之作，以短小精悍的篇幅描绘了春天早晨的美好景象，表达了诗人对春光消逝的惋惜之情。\n\n"春眠不觉晓"写出了春眠的舒适与美好，诗人在春天的早晨睡得香甜，不知不觉天已大亮。"处处闻啼鸟"则从听觉角度展现了春天的生机与活力，鸟鸣声声，处处皆是春意。\n\n"夜来风雨声，花落知多少"两句笔锋一转，由对春光的喜爱转为对落花的惋惜。诗人想起昨夜的风雨，不禁担忧花朵被吹落，这一细节体现了诗人对自然的敏感与怜惜之情。\n\n全诗语言浅显自然，意境深远，是唐诗中的经典之作。',
        },
        {
            'poem_title': '登鹳雀楼',
            'title': '《登鹳雀楼》赏析',
            'content': '《登鹳雀楼》是唐代诗人王之涣仅存的六首绝句之一，却是千古名篇。这首诗通过描绘登楼所见的壮丽景色，表达了积极向上的进取精神。\n\n"白日依山尽，黄河入海流"两句，描写了登楼所见的壮阔景象。夕阳依傍着山峦渐渐落下，滔滔黄河朝着大海汹涌奔流。诗人站在鹳雀楼上，视野开阔，将远山近水尽收眼底。\n\n"欲穷千里目，更上一层楼"是全诗的主旨所在，也是千古名句。诗人由景入理，揭示了要想看得更远，就必须站得更高的人生哲理。这两句诗激励着人们不断追求进步，勇攀高峰。\n\n全诗气势磅礴，意境雄浑，语言简洁，寓意深刻，是唐诗中的精品。',
        },
        {
            'poem_title': '水调歌头·明月几时有',
            'title': '《水调歌头·明月几时有》赏析',
            'content': '《水调歌头·明月几时有》是宋代文学家苏轼的代表作，这首词以月为线索，表达了词人对亲人的思念之情和对人生的思考。\n\n词的上片从对月的追问开始："明月几时有？把酒问青天"，词人举杯向青天发问，表现出豪放的性格。接着写对月宫的向往与犹豫："我欲乘风归去，又恐琼楼玉宇，高处不胜寒"，既想超脱尘世，又留恋人间。\n\n下片由中秋圆月联想到人间的离别："人有悲欢离合，月有阴晴圆缺，此事古难全"，词人以理遣情，从共同的遗憾中求得慰藉。最后以"但愿人长久，千里共婵娟"作结，表达了对远方亲人的美好祝愿。\n\n这首词意境豪放而阔大，情怀乐观而旷达，是中秋词中的千古绝唱。',
        },
    ]

    for app_data in appreciations_data:
        poem_title = app_data.pop('poem_title')
        poem = Poem.objects.get(title=poem_title)
        if not Appreciation.objects.filter(title=app_data['title'], poem=poem).exists():
            app_data['poem'] = poem
            app_data['author'] = admin_user
            Appreciation.objects.create(**app_data)
    print('Created appreciations')

    sample_comments = [
        {'poem_title': '静夜思', 'content': '这首诗太美了，每次读都会想起家乡。'},
        {'poem_title': '春晓', 'content': '孟浩然的诗总是那么清新自然。'},
        {'poem_title': '水调歌头·明月几时有', 'content': '但愿人长久，千里共婵娟，千古名句！'},
    ]

    for comment_data in sample_comments:
        poem_title = comment_data.pop('poem_title')
        poem = Poem.objects.get(title=poem_title)
        if not Comment.objects.filter(content=comment_data['content'], poem=poem).exists():
            comment_data['poem'] = poem
            comment_data['user'] = admin_user
            Comment.objects.create(**comment_data)
    print('Created comments')

    print('Data initialization completed!')


if __name__ == '__main__':
    run()
