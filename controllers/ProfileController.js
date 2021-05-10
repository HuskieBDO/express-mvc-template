const { User } = require('../models');

module.exports = {
  async update(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const { user } = req;

      /* if (data.email) {
        try {
          const confirmation = await EmailConfirmation.create({
            user_id: user.toJSON().id,
            email: data.email,
            token: sha256(
              `${process.env.APP_KEY}:${user.toJSON().id}:${data.email}`
            ),
          });
          Event.fire('user::confirmation', user, confirmation);
        } catch (e) {
          return res.status(400).send({
            status: 'error',
            message:
              'Вы уже сделали запрос на смену. Проверьте почту или повторите через 15 минут.',
          });
        }
        return res.status(200).send({
          status: 'success',
          message: 'На вашу почту отправлено подтверждение смены почты',
        });
      } */
      user.merge(data);
      await user.save();
      return res
        .status(200)
        .json({ status: 'success', message: 'Профиль успешно изменён' });
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ status: 'error', message: 'Ошибка запроса' });
    }
  },

  /* async confirmation(req, res, next) {
    const data = request.only(['token']);
    const user = await auth.getUser();
    if (!user) {
      return response.status(400).send({
        status: 'error',
        message: 'Вы не авторизованы! Войдите в профиль и повторите попытку.',
      });
    }
    const confirmation = await EmailConfirmation.findBy('token', data.token);
    if (confirmation) {
      user.email = confirmation.toJSON().email;
      await user.save();
      await confirmation.delete();
      return response.status(200).send({
        status: 'success',
        message: 'Почта успешно изменена!',
      });
    }
    return response.status(400).send({
      status: 'error',
      message: 'Ошибка! Ссылка истекла, выполните запрос повторно.',
    });
  }, */
};
