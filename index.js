const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const rmeme = require('rmeme');
const mime = require('mime-types')
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    if (msg.body === '!ping') {
        msg.reply('pong');
    } else if (msg.body === '!meme') {
        try {
            // Menggunakan rmeme untuk mendapatkan URL meme
            const memeUrl = rmeme.generate(); // Tidak menggunakan await karena ini bukan Promise
            const memeImg = await MessageMedia.fromUrl(memeUrl); // Unduh media dari URL meme
            msg.reply(memeImg); // Kirim meme ke pengirim
        } catch (err) {
            console.error('Error fetching meme:', err);
            msg.reply('Failed to fetch meme!');
        }
    } else if (msg.hasMedia) {
        msg.downloadMedia().then(media=>{
            if(media){
                const mediaPath = './downloaded-media/';
                if(!fs.existsSync(mediaPath)){
                    fs.mkdirSync(mediaPath)
                }
                const extension = mime.extension(media.mimetype)
                const filename = new Date().getTime();
                const fullFileName = mediaPath + filename + '.' + extension;
                //save file
                try{
                    fs.writeFileSync(fullFileName, media.data,{encoding: 'base64'});
                    console.log('File berhasil di Download!',fullFileName);
                    console.log(fullFileName);
                    MessageMedia.fromFilePath(filepath = fullFileName)
                    client.sendMessage(msg.from,new MessageMedia(media.mimetype,media.data,filename),{sendMediaAsSticker:true,stickerAuthor:"by nafe",stickerName:"STINGKER"})
                    fs.unlinkSync(fullFileName)
                    console.log('File Berhasil Dihapus!')
                }catch(err){
                    console.error('Gagal menyimpan File', err);
                    console.log('File berhasil dihapus!');
                }
            }
        })
    }
});

client.initialize();
