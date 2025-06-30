const isEmpty = (value: any): boolean => {
  if (!value) return true;
  if (value == undefined) return true;
  if (value === undefined) return true;
  if (typeof value === "undefined") return true;
  if (typeof value == "undefined") return true;
  if (value == "null") return true;
  if (value === null) return true;
  if (typeof value === "string" && value === "") return true;
  if (Array.isArray(value) && value.length < 1) return true;
  if (
    typeof value === "object" &&
    value.constructor.name === "Object" &&
    Object.keys(value).length < 1
  )
    return true;
  if (
    // new String()
    typeof value === "object" &&
    value.constructor.name === "String" &&
    Object.keys(value).length < 1
  )
    return true;
  return false;
};

export default isEmpty;
