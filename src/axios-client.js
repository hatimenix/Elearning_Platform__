import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/",
  // baseURL: "https://api.paiperleckelearning.com/",
});


axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_STUDENT_TOKEN");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;

    if (
      response &&
      response.status === 401 &&
      response.data.code === "token_not_valid"
    ) {
      const refreshToken = localStorage.getItem("REFRESH_TOKEN");
      if (!refreshToken) {
        // redirect to login page or show error message
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "http://localhost:8000/api/token/refresh/",
          { refresh: refreshToken }
        );
        const accessToken = response.data.access;
        localStorage.setItem("ACCESS_TOKEN", accessToken);
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(error.config);
      } catch (err) {
        // redirect to login page or show error message
        return Promise.reject(error);
      }
    }

    throw error;
  }
);

export default axiosClient;
