const stringValue = `חותמת זמן\tשם\tנסיעה 1 - שעת הנסיעה\tנסיעה 1 - פירוט הנסיעה\tנסיעה 2 - שעת הנסיעה\tנסיעה 2 - פירוט הנסיעה\tנסיעה 3 - שעת הנסיעה\tנסיעה 3 - פירוט הנסיעה\tמתי אני נוהגת?\tכבר השתבצת להכין סידור החודש?\tנסיעה 1 - שעת הנסיעה\tמתי אני נוהגת?\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 09:33:24\tמורן\t07:20\tיהל לרקפת, מורן לכרמיאל\t16:00\t16:00\tיהל ומורן מרקפת\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 09:34:06\tעינת\t7:15\tעינת מסיעה לגן דרור ואז לרכבת כרמיאל \t18:30\tעינת מכרמיאל רוצה לעבןר בסחנין חצי שעה\t\t\t\tכן\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 09:42:34\tרייצ'ל\t7:00\tרייצ'ל לכרמיאל לבי"ס \t14:15\tרייצ'ל מכרמיאל \t\t\tלא נוהגת \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 09:58:20\tזהר\t07:30\tזהר לחברתי\t14:30\tזהר מהחברתי\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 10:00:44\tאלון דרור\t15:50\tאלון לרקפת לאסוף את שקד \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 10:19:47\tנגה\t18:00\t18:00 עד 22:00 נגה צמוד לחיפה\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 10:25:28\tסתו\t7:30\tסתו צמוד עד 11:00\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 10:28:57\tשירי אליאס\t08:20\t"שירי צמוד לעכו עד 13:00. יכולה גם לנסות לחזור קצת קודם
 אם מסובך יכולה אולי תחבצ אבל אני צריכה לקחת לרקפת בבוקר"\t16:40\tשירי צמוד לכרמיאל עד אזור 19\t19:40\tשירי צמוד עד 21:15 למשגב \tלבדוק\tכן\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 11:19:38\tאייל יסוד\t7:15\t7:15 אייל עם הסידור ילדים לרקפת ואז למועצה \t13:30\t13:30 - מי שלוקח מגן חרוב אוסף את אייל מהמועצה לאיסוף של גן רימון \t15:30 \t15:30 אייל ליעד עד 18:00\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 11:20:07\tאייל יסוד\t19:00 \t19:00 אייל ליובלים עד הלילה \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 12:16:56\tאוריאל\t16:30\tאוריאל כרם ויסמין לקניות בכרמיאל עד שבע ורבע. \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 13:36:25\tתמה\t8:30\tתמה  לעכו עד  11:30. יכולה לצאת רבע שעה אחרי אם צריך.  לדבר איתי אם צריך תחבצ\t13:35\tתמה ואייל יסוד עם רכב 7 לרקפת לאסוף ילדי שיבולי השמש עד 14:30\t\t\tלבדוק  על נסיעות בוקר מוקדמות\tכן\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 13:36:31\tורד\t16:00\tורד לאסוף את אפיק מרקפת\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 13:46:24\tסתו\t16:00\tסתו צמוד עד 20 לרביד. גמישה קצת בשעת היציאה. \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 13:51:56\tרינת לוי\t7:20\tרינת לכרמיאל לרכבת של 7:59\t20:30\tרינת מרכבת כרמיאל\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 13:53:02\tעומר כהן\t8:00\tעומר לצורית/צומת צורית גילון/ כרמיאל \t\t\t\t\t\tלא\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 14:30:21\tענת\t6:50\tענת כרמית ומושית לגן דרור אולי יסתדר עם החלוץ \t14:30 \tענת כרמית ומושית מגן דרור אולי יסתדר עם החלוץ \t15:50\tדור מרקפת עם ענת \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 14:31:22\tענת\t16:30 \tענת עידו דור וירדן לכרמיאל עד 19:30 \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 14:52:07\tענבר\t09:40\tענבר למשגב צמוד עד 11:10 \t\t\t\t\t\tכן\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
02/11/2021 14:52:12\tעמיר\t7:00\tעמיר לרכבת כרמיאל \t17:00\tעמיר מרכבת כרמיאל (יכול לעלות עם 42) \t\t\tלא\tכן\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t`
const NewRowToken = 'New_row_';

interface EshbalRide {
    hour: string,
    text: string
}

interface EshbalOrder {
    name: string,
    rides: EshbalRide[]
}

const stringIntoRows = (str: string): string [] => {
    return str.split(NewRowToken).filter(s => s.replace(/\t/g, '').length > 5);
}
// const isFormDate = (cell: string): string[] | null => {
//     return cell.match(/(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/g);
// }
const DetectFormRows = (completeText: string): string => {
    let finalText = completeText.replace(/\n((0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4})/g, NewRowToken + '\$1');
    return finalText;
}
const rowsToEshbalOrders = (rows: string [][]): EshbalOrder[] => {
    let Eorders: EshbalOrder[] = [];

    return Eorders
}

export const ImportOrdersFromText = (text: string): any => {
    text = stringValue;
    const rowsWithoutUserLineBreaks = DetectFormRows(text)
    const rows = stringIntoRows(rowsWithoutUserLineBreaks);
    const rowsWithColumns = rows.map(r => r.split(/\t/g));

    setTimeout(_ => {
        console.clear();
        console.log(rowsWithColumns);
    }, 400)


}
