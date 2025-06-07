## Proje Hakkında

Bu proje, Discord.js v14 kullanılarak geliştirilmiş gelişmiş bir Discord botudur. Sunucunuz için çeşitli yönetim, eğlence ve özelleştirme özellikleri sunar. Hızlı ve ölçeklenebilir olacak şekilde tasarlanmıştır.

## Özellikler

- Slash Komut Desteği
- Etkinlik Yönetimi
- Veritabanı Entegrasyonu (MongoDB, Quick.db, nrc.db)
- Gelişmiş Moderasyon Yetenekleri (reklam engelleme vb.)
- Üye Kayıt ve Puan Sistemi
- Özelleştirilebilir Ayarlar (prefix, owner ID, renkler, emojiler)
- Sesli Kanal Yönetimi (sesli sohbet bağımlılıklarından anlaşılıyor)

## Gereksinimler

Bu botu çalıştırmak için aşağıdaki gereksinimlere sahip olmanız gerekmektedir:

- **Node.js**: Minimum v16.9.0 veya üzeri (önerilen LTS sürümü)
- **npm** veya **Yarn**: Paket yöneticisi
- **MongoDB Veritabanı**: Botun kayıt ve diğer verilerini saklamak için bir MongoDB Atlas hesabı veya yerel bir MongoDB sunucusu.
- **Discord Bot Token**: Discord Developer Portal üzerinden oluşturulmuş bir bot tokeni.

## Kurulum

Botu kendi sunucunuzda kurmak ve çalıştırmak için aşağıdaki adımları izleyin:

### 1. Depoyu Klonlayın

Öncelikle, bu depoyu GitHub hesabınızdan kendi bilgisayarınıza klonlayın:

```bash
git clone [REPOSITORY_URL]
cd [PROJECT_FOLDER_NAME]
```

### 2. Bağımlılıkları Yükleyin

Proje dizinine girdikten sonra, tüm gerekli Node.js bağımlılıklarını yüklemek için aşağıdaki komutu çalıştırın:

```bash
npm install
# veya
yarn install
```

### 3. Yapılandırma Dosyasını Ayarlayın

Botun çalışması için gerekli olan ayarları `src/config.js` dosyasında yapılandırmanız gerekmektedir. Bu dosyayı açın ve aşağıdaki alanları kendi bilgilerinizle doldurun:

```javascript
module.exports = {
  prefix: "/", // Botun komut ön eki
  owner: ["SİZİN_DISCORD_ID'NİZ"], // Bot sahibinin Discord ID'si (birden fazla olabilir)
  token: "SİZİN_BOT_TOKENİNİZ", // Discord Bot tokeniniz
  botid: "SİZİN_BOT_ID'NİZ", // Botunuzun ID'si
  renk: "#5100ff", // Embed mesajlarının varsayılan rengi
  // Diğer ayarlar (progressBar, progressBar1, pasifemoji, activeemoji, useremoji, keyemoji, tarihemoji) isteğe bağlı olarak düzenlenebilir.
};
```

`index.js` dosyasında aşağıdaki MongoDB bağlantı dizesini kendi MongoDB veritabanı bağlantı dizenizle güncelleyin:

```javascript
mongoose.connect('SİZİN_MONGODB_BAĞLANTI_DİZENİZ', { useNewUrlParser: true, useUnifiedTopology: true });
```

### 4. Botu Başlatın

Tüm yapılandırma adımlarını tamamladıktan sonra botu başlatmak için aşağıdaki komutu kullanın:

```bash
npm start
# veya
node index.js
```

Botunuzun aktif olduğunu Discord sunucunuzda görmelisiniz.

## Kullanım

Bu bot, slash komutlarını (/) kullanır. Komutları Discord sunucunuzdaki herhangi bir metin kanalında yazarak kullanabilirsiniz. Örnek olarak:

- `/ping`: Botun gecikmesini gösterir.

Diğer komutlar ve kullanımları `src/commands` klasöründe bulunabilir.

## Katkıda Bulunma

Projeye katkıda bulunmak isterseniz, lütfen aşağıdaki adımları izleyin:

1. Bu depoyu (repository) forklayın.
2. Kendi özellik dalınızı (feature branch) oluşturun: `git checkout -b ozellik/YeniOzellik`
3. Değişikliklerinizi yapın.
4. Değişikliklerinizi commit edin: `git commit -m 'feat: Yeni özellik eklendi'`
5. Dalınızı (branch) push edin: `git push origin ozellik/YeniOzellik`
6. Bir Pull Request (Çekme İsteği) oluşturun.

## Lisans

Bu proje [ISC Lisansı](LICENSE) altında lisanslanmıştır. 
