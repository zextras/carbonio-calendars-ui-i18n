Summary:            Calendar app for Zextras
Name:               zextras-zapp-calendar
Version:            0.0.3
Release:            1
License:            PROPRIETARY
Source:             com_zextras_zapp_calendar.zip
Requires:           zimbra-core zextras-zapp-shell
AutoReqProv:        no
URL:                https://zextras.com

%description
Calendar app for Zextras

%install
mkdir -p %{buildroot}/opt/zimbra/zimlets
cp %{_sourcedir}/com_zextras_zapp_calendar.zip \
  %{buildroot}/opt/zimbra/zimlets

%post
if [ $1 -eq 1 ]; then
  cat <<EOF
.: Congratulations! Every bit is in its right place :.

Please restart the Zimbra Web Application (mailboxd) manually.
E.g. « su - zimbra -c 'zmmailboxdctl restart' »
EOF
fi

%files
%defattr(-,zimbra,zimbra)
/opt/zimbra/zimlets/com_zextras_zapp_calendar.zip

%changelog
* Wed Nov 18 2020 Zextras Packaging Services <packaging@zextras.com>
- initial packaging
