import csv
import datetime

from django.core.exceptions import MultipleObjectsReturned
from django.core.management.base import BaseCommand

from common.models import Officer, Allegation

OFFICER_COLS = {
    'name': 3,
    'gender': 10,
    'birth_year': 8,
    'appt_date': 16,
    'unit': 18,
    'rank': 21,
    'star': 25,
    'race': 14,
}

ALLEGATION_COLS = {
    'crid': 0,
    'recc_finding': 32,
    'recc_outcome': 34,
    'final_finding': 38,
    'final_outcome': 40,
    'cat_id': 27,
}

RACE_TABLE = {
    'WBH': 'Black/Hispanic',
    'WHI': 'White',
    'WWH': 'White/Hispanic',
    'S': 'Hispanic',
    'U': 'Unknown',
    'BLK': 'Black',
    'API': 'Asian',
    'I': 'Native American',
}

END_OF_RECORD = 17
APPT_DATE_FORMAT = '%d-%b-%y'


class Command(BaseCommand):
    counters = {
        'updated': 0,
        'not_found': 0,
        'officers_created': 0,
        'created': 0
    }

    def add_arguments(self, parser):
        parser.add_argument('--file')
        parser.add_argument('--start-row')

    def get_officer(self, first_name, last_name, crid, star=False):
        if not first_name or not last_name:
            return

        first_name = first_name.strip()
        last_name = last_name.strip()

        try:
            allegation = Allegation.objects.get(crid=crid,
                                                officer__officer_first__iexact=first_name,
                                                officer__officer_last__iexact=last_name)
            return allegation.officer
        except Allegation.DoesNotExist:
            pass

        try:
            return Officer.objects.get(
                officer_first__iexact=first_name,
                officer_last__iexact=last_name,
                star=star
            )

        except Officer.DoesNotExist:
            try:
                return Officer.objects.get(
                    officer_first__iexact=first_name,
                    officer_last__iexact=last_name
                )

            except MultipleObjectsReturned:
                print("CRID: %s has an issue with multiple officers: %s %s %s" % (crid,first_name, last_name, star))
                return

        except ValueError:
            print ("CRID: %s has no star  %s %s %s" % (crid,first_name, last_name, star))


    def get_allegation(self, crid, officer):
        try:
            return Allegation.objects.get(crid=crid, officer=officer)

        except Allegation.DoesNotExist:
            return


    def handle(self, *args, **options):
        if not options.get('start_row',"").isnumeric():
            print("You must supply a start row, ex: --start-row 15")
            return

        start_row = int(options['start_row']) - 1

        with open(options['file']) as f:
            reader = csv.reader(f)

            counter = 0
            crid = False
            for row in reader:

                if counter < start_row:
                    counter += 1
                    continue

                if row[ALLEGATION_COLS['crid']]:
                    crid = row[ALLEGATION_COLS['crid']]
                    continue

                if row[END_OF_RECORD]:
                    crid = False

                if crid:

                    if not row[OFFICER_COLS['name']]:
                        continue

                    allegation_kw = {'crid': crid, 'document_pending': True}
                    for col in ALLEGATION_COLS:
                        if row[ALLEGATION_COLS[col]]:
                            allegation_kw[col] = row[ALLEGATION_COLS[col]]

                    officer_kw = {}
                    officer = Officer()
                    for col in OFFICER_COLS:
                        if not row[OFFICER_COLS[col]]:
                            continue
                        if col == 'name':
                            name = row[OFFICER_COLS[col]]
                            splitted = name.split(",")
                            first_name = splitted[1].strip()
                            last_name = splitted[0].strip()
                            star = row[OFFICER_COLS['star']]
                            officer_kw['officer_first'] = first_name.title()
                            officer_kw['officer_last'] = last_name.title()

                            officer = self.get_officer(first_name, last_name, crid, star)
                            if officer:
                                officer_kw['id'] = officer.pk

                        elif col == 'race':
                            officer_kw[col] = RACE_TABLE[row[OFFICER_COLS[col]].upper()]

                        elif col == 'appt_date':
                            officer_kw[col] = datetime.datetime.strptime(row[OFFICER_COLS[col]], APPT_DATE_FORMAT)

                        else:
                            officer_kw[col] = row[OFFICER_COLS[col]]

                    if not officer:
                        officer = Officer.objects.create(**officer_kw)
                        self.counters['officers_created'] += 1

                    else:
                        Officer.objects.filter(id=officer.pk).update(**officer_kw)

                    allegation = self.get_allegation(allegation_kw['crid'], officer)
                    allegation_kw['officer'] = officer

                    if not allegation:
                        allegation = Allegation.objects.create(**allegation_kw)
                        self.counters['created'] +=1

                    else:
                        Allegation.objects.filter(pk=allegation.pk).update(**allegation_kw)
                        self.counters['updated'] += 1

        print(self.counters)

