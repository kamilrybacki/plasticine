const satori = require('satori').default;

const convertToSvg = async (markup: string) => {
  return await satori(markup, {
    width: 600,
    height: 400,
    fonts: [
      {
        name: 'Inter',
        data: await inter,
        weight: 400,
        style: 'normal',
      },
    ],
  });
};
