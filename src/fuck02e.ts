const { platform } = Scratch.runtime;
if (platform.name !== 'Gandi' || platform.url !== 'https://getgandi.com/') {
    // maybe 02e
    alert(
        '⚠警告⚠\n本扩展由 ccw 平台的原作者开发。\n02 engine 曾在未署名的情况下搬运本扩展,并与原作者发生冲突。\n请支持原创,前往 https://ccw.site/ 使用正版。',
    );
}
