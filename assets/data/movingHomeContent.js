import images from '../../constants/images';
export const data = [
  {
    language: 'en',
    categories: [
      {
        key: 'general_tips',
        title: 'Tips for Moving to a New Apartment',
        content:
          "Moving to a new apartment is a significant project that requires careful planning to ensure a smooth transition with minimal issues. Whether you're a student or a busy professional, these tips will help you navigate the moving process successfully.",
        image: images.house_moving,
      },
      {
        key: 'rental_vehicle',
        title: 'Rental Vehicle',
        content:
          'If you decide to move by yourself, consider renting a commercial vehicle through a professional company. This can significantly reduce moving costs, especially if you have a lot of items to transport.',
        image: images.car_rent,
        link: 'https://www.suncar.co.il',
      },
      {
        key: 'decluttering',
        title: 'Decluttering',
        content:
          'Before moving, go through your belongings and declutter. Sell items you no longer need or donate them to a charity. This not only helps you move with only what you need but also puts some extra cash in your pocket.',
        image: images.stuff_sale,
      },
      {
        key: 'organization',
        title: 'Organization',
        content:
          "It's essential to stay organized during the move. Label each box with its contents and the room it belongs to. Take valuable items with you to avoid them getting lost or damaged during the move.",
        image: images.house_filter,
      },
      {
        key: 'moving_services',
        title: 'Recommended Moving Services',
        content:
          'Choosing a reliable moving company can make all the difference. Here are some trusted movers in Israel:',
        image: images.moving_company,
        services: [
          {
            name: 'GetMoving',
            description:
              'GetMoving is a platform that allows you to compare quotes from various moving companies. It’s an excellent way to find a reliable mover at a competitive price.',
            link: 'https://www.getmoving.co.il',
          },
          {
            name: 'Movers Israel',
            description:
              'Movers Israel provides nationwide moving services with experienced professionals. They offer packing, moving, and storage solutions.',
            link: 'https://www.moversisrael.co.il',
          },
          {
            name: 'Hovalot Movers',
            description:
              'Hovalot Movers offers a wide range of services including small moves, full house moves, and office relocations. They also provide packing materials and assistance.',
            link: 'https://www.hovalot.org.il/',
          },
        ],
      },
      {
        key: 'contract',
        title: 'Contract',
        content:
          "If you hire a moving company, carefully review the contract to understand their responsibility regarding lost or damaged items. A signed agreement can protect you and ensure you're compensated if something goes wrong.",
        image: images.contract,
      },
      {
        key: 'student_specific',
        title: 'Student-Specific Tips',
        content:
          "Moving as a student can be challenging, especially if it's your first time. Make sure to plan your move during a convenient time, such as during a semester break. If there's a gap between your move-out and move-in dates, consider temporary storage solutions.",
        image: images.student,
      },
      {
        key: 'storage',
        title: 'Storage Solutions',
        content:
          'If there’s a gap between leaving your current apartment and moving into a new one, or if you’re planning to travel, you might need storage. Storage facilities offer secure, climate-controlled units that can accommodate your needs.',
        image: images.storage_sol,
        link: 'https://www.storageisrael.co.il',
      },
    ],
  },
  {
    language: 'he',
    categories: [
      {
        key: 'general_tips',
        title: 'טיפים למעבר דירה',
        content:
          'מעבר לדירה חדשה הוא פרויקט משמעותי שדורש תכנון קפדני כדי להבטיח מעבר חלק ומינימום תקלות. בין אם אתם סטודנטים או אנשי מקצוע עסוקים, הטיפים הללו יעזרו לכם לנווט את תהליך המעבר בהצלחה.',
        image: 'houseMovingConcept',
      },
      {
        key: 'rental_vehicle',
        title: 'השכרת רכב',
        content:
          'אם אתם מחליטים לבצע את המעבר בעצמכם, מומלץ לשכור רכב מסחרי דרך חברה מקצועית. זה יכול להוזיל באופן משמעותי את עלויות ההובלה, במיוחד אם יש לכם הרבה חפצים להעביר.',
        image: 'rentalVehicleImage',
        link: 'https://www.suncar.co.il',
      },
      {
        key: 'decluttering',
        title: 'סינון חפצים',
        content:
          'לפני המעבר, עברו על החפצים שלכם ובצעו סינון. מכרו או תרמו פריטים שאין לכם צורך בהם. זה לא רק יעזור לכם לעבור עם מה שאתם באמת צריכים, אלא גם יכול להכניס כסף נוסף לכיס.',
        image: 'declutteringImage',
      },
      {
        key: 'organization',
        title: 'סדר וארגון',
        content:
          'חשוב מאוד לשמור על סדר במהלך המעבר. סמנו כל קופסה עם תוכנה והחדר אליו היא שייכת. קחו איתכם חפצים בעלי ערך כדי להימנע מאובדן או נזק במהלך ההובלה.',
        image: 'organizationImage',
      },
      {
        key: 'moving_services',
        title: 'שירותי הובלה מומלצים',
        content:
          'בחירת חברת הובלות אמינה יכולה לעשות את כל ההבדל. הנה כמה מובילים מומלצים בישראל:',
        image: 'movingServicesImage',
        services: [
          {
            name: 'GetMoving',
            description:
              'GetMoving הוא פלטפורמה שמאפשרת להשוות הצעות מחיר ממובילים שונים. זוהי דרך מצוינת למצוא מוביל אמין במחיר תחרותי.',
            link: 'https://www.getmoving.co.il',
          },
          {
            name: 'Movers Israel',
            description:
              'Movers Israel מספקים שירותי הובלות בכל הארץ עם אנשי מקצוע מנוסים. הם מציעים פתרונות אריזה, הובלה ואחסון.',
            link: 'https://www.movers-israel.co.il',
          },
          {
            name: 'Hovalot Movers',
            description:
              'Hovalot Movers מציעים מגוון רחב של שירותים כולל העברות קטנות, העברות בתים מלאות והעברות משרדים. הם גם מספקים חומרי אריזה וסיוע.',
            link: 'https://www.hovalot.org.il/',
          },
        ],
      },
      {
        key: 'contract',
        title: 'חוזה',
        content:
          'אם אתם שוכרים חברת הובלה, חשוב לבדוק את תנאי החוזה כדי להבין את מידת האחריות שלהם לגבי אובדן או נזק לתכולה. הסכם חתום יכול להגן עליכם ולהבטיח פיצוי במידה ותצטרכו.',
        image: 'contractImage',
      },
      {
        key: 'student_specific',
        title: 'טיפים לסטודנטים',
        content:
          'מעבר דירה כסטודנט יכול להיות מאתגר, במיוחד אם זה הפעם הראשונה. ודאו שאתם מתכננים את המעבר בזמן נוח, כמו במהלך חופשת סמסטר. אם יש פער בין מועד פינוי הדירה למעבר, שקלו פתרונות אחסון זמניים.',
        image: 'studentMovingImage',
      },
      {
        key: 'storage',
        title: 'פתרונות אחסון',
        content:
          'אם יש פער בין פינוי הדירה הנוכחית למעבר לדירה החדשה, או אם אתם מתכננים לנסוע, ייתכן שתצטרכו אחסון זמני. מחסני אחסון מציעים יחידות שמורות ובקרות אקלים המתאימות לצורכיכם.',
        image: 'storageImage',
        link: 'https://www.storageisrael.co.il',
      },
    ],
  },
];
