import nanoid from "nanoid";

interface Props {
  length?: number;
}

export const randomIdGenerator = () => {
  const idLength = 10;
  const uuid = Math.floor(Math.random() * 9999999999);

  console.log({ uuid });
  return uuid;
};
