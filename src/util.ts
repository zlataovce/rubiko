export const USER_AGENT = "rubiko/1.0.0 (github.com/zlataovce/rubiko)";

export const enum Color {
    Default = 0x000000,
    White = 0xffffff,
    Aqua = 0x1abc9c,
    Green = 0x57f287,
    Blue = 0x3498db,
    Yellow = 0xfee75c,
    Purple = 0x9b59b6,
    LuminousVividPink = 0xe91e63,
    Fuchsia = 0xeb459e,
    Gold = 0xf1c40f,
    Orange = 0xe67e22,
    Red = 0xed4245,
    Grey = 0x95a5a6,
    Navy = 0x34495e,
    DarkAqua = 0x11806a,
    DarkGreen = 0x1f8b4c,
    DarkBlue = 0x206694,
    DarkPurple = 0x71368a,
    DarkVividPink = 0xad1457,
    DarkGold = 0xc27c0e,
    DarkOrange = 0xa84300,
    DarkRed = 0x992d22,
    DarkGrey = 0x979c9f,
    DarkerGrey = 0x7f8c8d,
    LightGrey = 0xbcc0c0,
    DarkNavy = 0x2c3e50,
    Blurple = 0x5865f2,
    Greyple = 0x99aab5,
    DarkButNotBlack = 0x2c2f33,
    NotQuiteBlack = 0x23272a,
}

const colors = [
    Color.Default,
    Color.White,
    Color.Aqua,
    Color.Green,
    Color.Blue,
    Color.Yellow,
    Color.Purple,
    Color.LuminousVividPink,
    Color.Fuchsia,
    Color.Gold,
    Color.Orange,
    Color.Red,
    Color.Grey,
    Color.Navy,
    Color.DarkAqua,
    Color.DarkGreen,
    Color.DarkBlue,
    Color.DarkPurple,
    Color.DarkVividPink,
    Color.DarkGold,
    Color.DarkOrange,
    Color.DarkRed,
    Color.DarkGrey,
    Color.DarkerGrey,
    Color.LightGrey,
    Color.DarkNavy,
    Color.Blurple,
    Color.Greyple,
    Color.DarkButNotBlack,
    Color.NotQuiteBlack,
];

export const randomColor = (): Color => colors[Math.floor(Math.random() * colors.length)];
