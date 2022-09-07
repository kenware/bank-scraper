FROM node:14-stretch

ENV APP_PATH=/usr/src/app NPM_CONFIG_LOGLEVEL=warn

WORKDIR $APP_PATH
COPY . $APP_PATH

RUN npm set progress=false && npm i -g typescript@4.3.2 nodemon@2.0.7 forever@4.0.0 && \
npm i && npm cache verify && npm run build
RUN bash -c "chmod +x ./docker/run.sh"

RUN tsc

EXPOSE 3000 8080

CMD ["./docker/run.sh"]
