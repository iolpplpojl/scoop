export function getSubFromLoginToken() {
    const token = localStorage.getItem("logintoken");
    if (!token) {
      console.warn("로그인 토큰이 존재하지 않습니다.");
      return "";
    }
  
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("유효하지 않은 토큰 형식입니다.");
      }
      const payload = parts[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.sub || "";
    } catch (error) {
      console.error("토큰 파싱 중 오류 발생:", error);
      return "";
    }
  }
  