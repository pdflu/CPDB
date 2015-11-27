import factory
from faker import Faker

from share.models import Session
from api.models import Setting


fake = Faker()


class SessionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Session

    title = factory.Sequence(lambda n: fake.name())
    query = factory.Sequence(lambda n: {'title': fake.name()})
    ip = factory.Sequence(lambda n: '0.0.0.0')
    user_agent = factory.Sequence(lambda n: fake.name())
    share_from = None


class SettingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Setting

    key = factory.Sequence(lambda n: "key_{number}".format(number=n))
    value = factory.Sequence(lambda n: fake.name())
