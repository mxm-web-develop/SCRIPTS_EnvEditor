import * as fs from 'fs';

interface UpdateDto {
  [key: string]: string;
}

class EnvManager {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    // 如果指定的 filePath 没有找到对应的 .env 文件，那么根据 filePath 创建 .env 文件
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '');
    }
  }

  // 获取指定路径的 .env 文件内容，并且转换成对象的结构进行返回
  readAsObject() {
    const content = fs.readFileSync(this.filePath, { encoding: 'utf-8' });
    const result: { [key: string]: string } = {};
    content.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        result[key.trim()] = value.trim();
      }
    });
    return result;
  }

  // 更新 .env 文件的内容
  update(data: UpdateDto[]) {
    const env = this.readAsObject();
    data.forEach(dto => {
      for (const key in dto) {
        env[key] = dto[key];
      }
    });

    const newContent = Object.keys(env).map(key => `${key}=${env[key]}`).join('\n');
    fs.writeFileSync(this.filePath, newContent);
  }

  // 根据传入的 key 删除对应 .env 文件中的条目
  remove(keyArray: string[]) {
    const env = this.readAsObject();
    keyArray.forEach(key => {
      delete env[key];
    });

    const newContent = Object.keys(env).map(key => `${key}=${env[key]}`).join('\n');
    fs.writeFileSync(this.filePath, newContent);
  }
}

export default EnvManager;
